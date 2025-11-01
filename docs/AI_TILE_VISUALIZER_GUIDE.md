# AI Tile Visualizer - Complete Guide

## Overview
The AI Tile Visualizer is a cutting-edge feature that allows users to upload photos of their rooms and visualize how AlmasCeram tiles would look in their actual space using Google's Gemini AI API.

## Features

### 1. **Room Photo Upload**
- Users can upload high-quality images of their rooms (JPEG, PNG, up to 10MB)
- Best results with clear, well-lit photos
- Instant preview after upload

### 2. **Tile Selection**
- Browse all available tiles organized by dimension
- Select up to 2 different tiles to visualize
- Real-time selection preview
- Easy removal of selected tiles

### 3. **AI-Powered Visualization**
- Uses Google Gemini Pro Vision API for accurate tile placement
- Considers:
  - Room perspective and geometry
  - Lighting conditions
  - Surface types (floors, walls, backsplashes)
  - Tile dimensions and finish (matt/polished/textured)
  - Realistic grout lines
  - Reflections and shadows

### 4. **Result Download**
- High-quality downloadable results
- Timestamped filename for organization

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`):

```env
# Gemini AI API Key
VITE_GEMINI_API_KEY=your_actual_api_key_here

# Backend URL
VITE_API_URL=http://localhost:3001
```

**Important:** Never commit your `.env` file to version control!

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
# Start backend
cd backend
npm run server

# Start frontend (in another terminal)
npm run dev
```

## Usage Guide

### For End Users

1. **Navigate to Inspiration Page**
   - Go to `/inspiration` route
   - Scroll to "Visualize Tiles in Your Space" section

2. **Upload Room Photo**
   - Click "Choose Image" button
   - Select a clear photo of your room
   - Image appears with confirmation

3. **Select Tiles**
   - Click "Browse Tiles" button
   - Browse tiles organized by dimensions (30x30, 60x60, 60x120, etc.)
   - Click on tiles to select (max 2)
   - Selected tiles show in the sidebar

4. **Generate Visualization**
   - Click "Generate AI Visualization" button
   - Wait for AI processing (may take 10-30 seconds)
   - View result in the right panel

5. **Download Result**
   - Click "Download" button to save the visualization
   - Use the image for planning and decision-making

### For Developers

#### Component Structure

```
src/components/TileVisualizer.tsx
├── Upload Section
│   ├── File input handler
│   ├── Image preview
│   └── Reset functionality
├── Tile Selection
│   ├── Browse dialog
│   ├── Grouped by dimension
│   └── Selection management (max 2)
├── AI Processing
│   ├── Gemini API integration
│   ├── Prompt engineering
│   └── Error handling
└── Result Display
    ├── Visualization preview
    ├── Download functionality
    └── Metadata display
```

#### API Integration

The visualizer uses Google's Gemini Pro Vision API:

```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
          // ... tile images
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    }),
  }
);
```

#### Prompt Engineering

The AI prompt includes:
- Task description (realistic tile placement)
- Surface identification instructions
- Perspective and lighting requirements
- Finish-specific rendering (matt/polished/textured)
- Grout line specifications
- Photorealism requirements

## Technical Architecture

### Frontend
- **React 18.3.1** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **React Hot Toast** for notifications

### AI Integration
- **Google Gemini Pro Vision API**
- Image-to-image transformation
- Multi-modal input (text + images)

### Data Flow
1. User uploads room photo → Base64 encoding
2. User selects tiles → Fetch from product service
3. Click generate → Prepare API payload
4. Send to Gemini API → AI processing
5. Receive result → Display & download

## API Costs & Limits

### Gemini API Pricing (as of 2024)
- **Free Tier**: 60 requests per minute
- **Paid Tier**: Higher rate limits available

### Image Size Recommendations
- Input: Max 10MB, recommended 2-5MB
- Resolution: 1920x1080 or higher for best results
- Format: JPEG or PNG

## Best Practices

### For Optimal Results

1. **Room Photos**
   - Take photos in good lighting
   - Include the surfaces you want to tile (floors/walls)
   - Avoid extreme angles
   - Clear, uncluttered spaces work best

2. **Tile Selection**
   - Choose tiles appropriate for the surface
   - Consider dimension relative to room size
   - Mix textures thoughtfully (max 2 tiles)

3. **Performance**
   - Compress large images before upload
   - Close unnecessary browser tabs
   - Wait for complete processing

### Error Handling

The component handles:
- Missing API key → User-friendly error
- Network failures → Retry suggestions
- Invalid images → Size/format validation
- API rate limits → Graceful degradation

## Troubleshooting

### "API key not configured"
**Solution:** Add `VITE_GEMINI_API_KEY` to your `.env` file

### "Image too large"
**Solution:** Compress image to under 10MB using tools like TinyPNG

### "Failed to generate visualization"
**Possible causes:**
- Network connection issues
- API rate limit reached
- Invalid API key
- Server downtime

**Solutions:**
1. Check internet connection
2. Wait a few minutes (rate limit)
3. Verify API key in `.env`
4. Check Google AI Studio status

### Visualization doesn't look realistic
**Improvements:**
- Use higher quality room photos
- Ensure good lighting in original photo
- Select tiles appropriate for the surface
- Try different tile combinations

## Future Enhancements

### Planned Features
- [ ] Multiple room area selection
- [ ] 3D perspective adjustment
- [ ] Before/after slider
- [ ] Save to user account
- [ ] Share visualizations
- [ ] AR preview integration
- [ ] Batch processing (multiple tile combinations)
- [ ] Color customization
- [ ] Grout color selection

### Advanced AI Features
- [ ] Automatic surface detection
- [ ] Smart tile size recommendations
- [ ] Pattern matching
- [ ] Style suggestions
- [ ] Cost estimation integration

## Security Considerations

1. **API Key Protection**
   - Never expose API keys in frontend code
   - Use environment variables
   - Implement rate limiting
   - Consider backend proxy for production

2. **Image Upload**
   - Validate file types and sizes
   - Scan for malicious content
   - Implement user quotas
   - Store images securely (if persisting)

3. **Privacy**
   - Don't store user-uploaded images without consent
   - Clear temporary files
   - GDPR compliance for EU users
   - Privacy policy updates

## Performance Optimization

### Current Optimizations
- Lazy loading of tile images
- Chunked product loading (100 at a time)
- Image compression before API send
- Request debouncing

### Recommended Production Optimizations
- CDN for tile images
- Backend API proxy
- Result caching
- Progressive image loading
- WebP format support

## Support

### For Users
- Email: support@almasceram.com
- Documentation: This guide
- Video tutorials: Coming soon

### For Developers
- GitHub Issues: Report bugs
- Code documentation: See component comments
- API Documentation: [Google AI Studio Docs](https://ai.google.dev/)

## License

Proprietary - AlmasCeram © 2024

---

**Last Updated:** October 30, 2024  
**Version:** 1.0.0  
**Maintained by:** AlmasCeram Development Team



