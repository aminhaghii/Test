const express = require('express');
const router = express.Router();
const { getProducts } = require('../database');

// Use built-in fetch (Node 18+)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') return { mime: 'image/png', base64: '' };
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mime: match[1] || 'image/png', base64: match[2] || '' };
  }
  // Fallback: split by comma
  const base64 = String(dataUrl).split(',')[1] || '';
  return { mime: 'image/png', base64 };
}

function parseRetryAfter(details) {
  try {
    const retryInfo = (details || []).find(d => d['@type']?.includes('RetryInfo'));
    if (!retryInfo) return 0;
    const val = retryInfo.retryDelay || retryInfo.retry_delay || '0s';
    const seconds = parseInt(String(val).replace(/s$/, ''), 10);
    return Number.isFinite(seconds) ? seconds : 0;
  } catch {
    return 0;
  }
}

router.post('/visualize', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
    }

    const { roomDataUrl, textureDataUrls = [], width, height } = req.body || {};
    if (!roomDataUrl || !Array.isArray(textureDataUrls) || textureDataUrls.length === 0) {
      return res.status(400).json({ error: 'roomDataUrl and at least one textureDataUrl are required' });
    }

    const parts = [];
    // Room image with correct mime
    const roomParsed = parseDataUrl(roomDataUrl);
    parts.push({ inline_data: { mime_type: roomParsed.mime || 'image/png', data: roomParsed.base64 } });

    // Texture images (max 2 as per product spec)
    for (const dataUrl of textureDataUrls.slice(0, 2)) {
      const parsed = parseDataUrl(dataUrl);
      parts.push({ inline_data: { mime_type: parsed.mime || 'image/png', data: parsed.base64 } });
    }

    const prompt = `Edit the first image by replacing the floor/wall surfaces with the provided tile texture images realistically.
Requirements:
- Maintain correct perspective, lighting, shadows, and scale.
- Blend tiles naturally, avoid artifacts.
- Output a single PNG image as inline data.
- Do not add watermarks or text.
If two textures are provided, use the first for floor, second for accent wall if present.`;

    parts.push({ text: prompt });

    const generationConfig = {
      temperature: 0.5,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 65536
    };

    const body = {
      contents: [{ role: 'user', parts }],
      generationConfig
    };

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);

    async function callOnce() {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await resp.json().catch(() => ({}));
      return { ok: resp.ok, status: resp.status, json };
    }

    let result = await callOnce();
    if (!result.ok && result.status === 429) {
      const waitSeconds = parseRetryAfter(result.json?.error?.details) || 60;
      await new Promise(r => setTimeout(r, waitSeconds * 1000));
      result = await callOnce();
      if (!result.ok) {
        return res.status(429).json({ error: 'Rate limited', retryAfter: waitSeconds, details: result.json });
      }
    }

    if (!result.ok) {
      const errMsg = result.json?.error?.message || result.json?.error || 'Gemini request failed';
      console.error('Gemini 4xx/5xx:', JSON.stringify(result.json));
      return res.status(result.status || 500).json({ error: errMsg, details: result.json });
    }

    // Find inline image
    const candidates = result.json?.candidates || [];
    let dataUrl = '';
    for (const c of candidates) {
      for (const p of c.content?.parts || []) {
        if (p.inline_data?.data) {
          dataUrl = 'data:image/png;base64,' + p.inline_data.data;
          break;
        }
        if (typeof p.text === 'string') {
          const m = p.text.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/);
          if (m) { dataUrl = m[0]; break; }
        }
      }
      if (dataUrl) break;
    }

    if (!dataUrl) {
      return res.status(502).json({ error: 'AI did not return an image' });
    }

    return res.json({ imageDataUrl: dataUrl, width, height });
  } catch (err) {
    console.error('AI visualize error:', err);
    return res.status(500).json({ error: 'Server error', message: err?.message });
  }
});

// Build AI context for chat assistant
async function buildAIContext() {
  try {
    const result = getProducts({ isActive: true }, { page: 1, pageSize: 1000 });
    const products = result.products || [];
    
    const productList = products.map(p => {
      const specs = p.technical_specs && typeof p.technical_specs === 'object' 
        ? Object.entries(p.technical_specs).map(([k, v]) => `${k}: ${v}`).join(', ')
        : '';
      return `- ${p.name} (${p.dimension}, ${p.surface}, ${p.body_type})${p.price ? `: $${p.price}` : ''}${specs ? ` - ${specs}` : ''}`;
    }).join('\n');

    const dimensions = [...new Set(products.map(p => p.dimension))].sort().join(', ');
    const surfaces = [...new Set(products.map(p => p.surface))].sort().join(', ');
    const bodyTypes = [...new Set(products.map(p => p.body_type))].sort().join(', ');

    const context = `COMPANY: Almas Kavir Rafsanjan
LOCATION: 10km Rafsanjan-Kerman Road, Kerman Province, Iran
PHONE: +98 21-88218520
EMAIL: info@almasceram.com
CERTIFICATIONS: ISO 9001:2015, ISO 14001:2015, ISO 45001:2018
FOUNDED: 2010
EXPERIENCE: 14+ years manufacturing premium ceramic tiles

PRODUCTS (${products.length} tiles):
${productList || 'No products available'}

AVAILABLE DIMENSIONS: ${dimensions || 'Various'}
AVAILABLE SURFACES: ${surfaces || 'Various'}
BODY TYPES: ${bodyTypes || 'Various'}

SERVICES:
- AI Tile Visualizer: Upload room photo, see tiles in your space
- Export to 13 countries worldwide
- Custom project consultation and design support
- Technical specifications and certifications
- Sample requests available

SITE FEATURES:
- Browse products by dimension, surface, or material type
- View texture images and environment mockups (DECORED photos)
- Download catalogs and quality certifications
- Request quotes and project estimates
- Multilingual support

INSTRUCTIONS:
- Answer questions about products, specifications, pricing, certifications, and company info
- Be professional, helpful, and concise
- Reference specific tiles by name, dimension, or attributes when relevant
- If uncertain about pricing or availability, suggest contacting the team directly
- Always respond in the same language the user writes in (English/Persian)
- If asked about products, list key details like dimensions, surface, body type, and approximate price if available`;

    return context;
  } catch (err) {
    console.error('Error building AI context:', err);
    return 'Company information currently unavailable. Please contact support.';
  }
}

// GET /api/ai/context - Get context for AI chat
router.get('/context', async (req, res) => {
  try {
    const context = await buildAIContext();
    res.json({ context });
  } catch (err) {
    console.error('Error getting AI context:', err);
    res.status(500).json({ error: 'Failed to get context', message: err?.message });
  }
});

// POST /api/ai/chat - Chat with Groq AI
router.post('/chat', async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY on server' });
    }

    const { message, conversationHistory = [] } = req.body || {};
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = await buildAIContext();

    const systemPrompt = `You are Almas Assistant, an expert customer support agent for Almas Kavir Rafsanjan, a premium Iranian ceramic tile manufacturer.

COMPANY KNOWLEDGE:
${context}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5), // Last 5 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        model: 'openai/gpt-oss-120b',
        temperature: 0.7,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false // Non-streaming for simplicity
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({ 
        error: 'AI service temporarily unavailable',
        details: errorData 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Server error', message: err?.message });
  }
});

module.exports = router;


