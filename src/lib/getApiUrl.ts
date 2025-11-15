/**
 * Get the API URL, automatically detecting the server IP when on mobile devices
 * This replaces localhost with the actual server IP address
 * 
 * When accessing from mobile device on the same network:
 * - If frontend is accessed via IP (e.g., http://192.168.1.100:8080)
 * - API will automatically use the same IP (e.g., http://192.168.1.100:3001)
 */
export function getApiUrl(): string {
  // In production, use relative URLs or environment variable
  if (import.meta.env.PROD) {
    const envApiUrl = import.meta.env.VITE_API_URL;
    if (envApiUrl) {
      return envApiUrl;
    }
    // In production without explicit API URL, assume API is on same domain
    // This works if backend is deployed as serverless functions or separate service
    return '/api';
  }

  // Development mode
  // If VITE_API_URL is explicitly set and doesn't contain localhost, use it
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && !envApiUrl.includes('localhost') && !envApiUrl.includes('127.0.0.1')) {
    if (typeof window !== 'undefined') {
      console.log('[getApiUrl] Using explicit VITE_API_URL:', envApiUrl);
    }
    return envApiUrl;
  }

  // In browser environment, detect the server IP from current location
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = '3001';
    
    // If we're accessing via IP address (not localhost), use that IP for API too
    // This is crucial for mobile devices on the same network
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const apiUrl = `http://${hostname}:${port}`;
      console.log('[getApiUrl] Detected IP from hostname:', apiUrl);
      return apiUrl;
    }
    
    // If on localhost, check if we can get the actual network IP
    // For development, you might want to set VITE_API_URL to your local IP
    // Example: VITE_API_URL=http://192.168.1.100:3001
    console.warn('[getApiUrl] Using localhost. For mobile access, use IP address or set VITE_API_URL');
  }

  // Fallback to environment variable or default localhost
  const fallbackUrl = envApiUrl || 'http://localhost:3001';
  if (typeof window !== 'undefined') {
    console.log('[getApiUrl] Using fallback URL:', fallbackUrl);
  }
  return fallbackUrl;
}

// Export a constant that can be used directly
export const API_URL = getApiUrl();

