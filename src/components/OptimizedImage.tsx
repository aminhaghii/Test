import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For LCP images
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images load immediately
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Generate WebP/AVIF sources if original is JPG/PNG
  const getModernFormats = (originalSrc: string) => {
    const isLocalImage = originalSrc.startsWith('/') || originalSrc.includes('localhost');
    if (!isLocalImage) return null;

    const withoutExt = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    const ext = originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '';

    return {
      avif: ext ? `${withoutExt}.avif` : null,
      webp: ext ? `${withoutExt}.webp` : null,
    };
  };

  const modernFormats = getModernFormats(src);
  const shouldLoad = isInView || priority;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    >
      {shouldLoad ? (
        <picture>
          {modernFormats?.avif && (
            <source srcSet={modernFormats.avif} type="image/avif" />
          )}
          {modernFormats?.webp && (
            <source srcSet={modernFormats.webp} type="image/webp" />
          )}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            className={`w-full h-full transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectFit,
            }}
          />
        </picture>
      ) : (
        <div className="w-full h-full bg-slate-200 animate-pulse" />
      )}
    </div>
  );
};

