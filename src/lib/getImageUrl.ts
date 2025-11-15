/**
 * Get the correct image URL for static assets
 * In production, images are served directly from public folder
 * In development, they can be served from API or public folder
 */
export function getImageUrl(imagePath: string): string {
  // Remove leading slash if present for consistency
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // If it's already a full URL (http/https), return as is
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // In production, serve directly from public folder
  // Vite will handle these paths correctly
  if (import.meta.env.PROD) {
    return cleanPath;
  }
  
  // In development, check if we should use API_URL
  // For static assets in public folder, use direct path
  // For assets served by backend, use API_URL
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // If image is from ALMAS, DECORED, or Content folders, serve from public in dev too
  // unless explicitly configured to use API
  if (cleanPath.startsWith('/ALMAS/') || 
      cleanPath.startsWith('/DECORED/') || 
      cleanPath.startsWith('/Content/')) {
    return cleanPath;
  }
  
  // For other paths, use API_URL if available
  if (apiUrl && !apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1')) {
    return `${apiUrl}${cleanPath}`;
  }
  
  // Fallback to direct path
  return cleanPath;
}

/**
 * Get API URL for backend resources (not static images)
 */
export function getApiUrl(): string {
  if (import.meta.env.PROD) {
    const envApiUrl = import.meta.env.VITE_API_URL;
    if (envApiUrl) {
      return envApiUrl;
    }
    return '/api';
  }
  
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && !envApiUrl.includes('localhost') && !envApiUrl.includes('127.0.0.1')) {
    return envApiUrl;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3001`;
    }
  }
  
  return envApiUrl || 'http://localhost:3001';
}

