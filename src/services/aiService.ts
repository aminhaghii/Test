export type VisualizeRequest = {
  roomDataUrl: string;
  textureDataUrls: string[]; // data URLs (base64)
  width?: number;
  height?: number;
};

export type VisualizeResponse = {
  imageDataUrl: string;
  width?: number;
  height?: number;
  retryAfter?: number;
};

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const aiService = {
  async visualize(payload: VisualizeRequest): Promise<VisualizeResponse> {
    const base = API_BASE || window.location.origin.replace(/:\d+$/, ':3001');
    const resp = await fetch(`${base}/api/ai/visualize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!resp.ok) {
      if (resp.status === 429) {
        const retryAfter = data?.retryAfter || 60;
        const err = new Error('Rate limited');
        // @ts-expect-error augment
        err.retryAfter = retryAfter;
        throw err;
      }
      const detail = data?.error || data?.message || data?.raw || `HTTP ${resp.status}`;
      throw new Error(String(detail));
    }
    return data as VisualizeResponse;
  },
};


