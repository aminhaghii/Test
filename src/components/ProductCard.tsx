import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Product } from '@/services/productServiceBackend';
import { useLanguage } from '@/contexts/LanguageContext';

import { getImageUrl } from '@/lib/getImageUrl';

interface ProductCardProps {
  product: Product;
  currentImageIndex: number;
  onImageChange: (productId: string, index: number) => void;
  onClick: (product: Product) => void;
  extractProductName: (name: string) => string;
  priority?: boolean; // For LCP images
}

const ProductCard = memo<ProductCardProps>(({
  product,
  currentImageIndex,
  onImageChange,
  onClick,
  extractProductName,
  priority = false
}) => {
  const { t } = useLanguage();
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Memoize image URLs processing
  const allImages = useMemo(() => {
    const images: string[] = [];
    
    // Process main image_url
    if (product.image_url && product.image_url.trim()) {
      const mainImage = product.image_url.startsWith('http') 
        ? product.image_url 
        : getImageUrl(product.image_url);
      images.push(mainImage);
    }
    
    // Process additional_images
    if (product.additional_images && Array.isArray(product.additional_images)) {
      product.additional_images.forEach(img => {
        if (img && img.trim()) {
          const processedImg = img.startsWith('http') 
            ? img 
            : getImageUrl(img);
          images.push(processedImg);
        }
      });
    }
    
    // Process texture_images
    if (product.texture_images && Array.isArray(product.texture_images)) {
      product.texture_images.forEach(img => {
        if (img && img.trim()) {
          const processedImg = img.startsWith('http') 
            ? img 
            : getImageUrl(img);
          images.push(processedImg);
        }
      });
    }
    
    // Always return at least one image (placeholder if no images found)
    if (images.length === 0) {
      return [`https://via.placeholder.com/400x400/f5f5f0/8B7355?text=${encodeURIComponent(product.name)}`];
    }
    
    return images;
  }, [product.image_url, product.additional_images, product.texture_images, product.name]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current || isInView) return;

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
        rootMargin: '100px', // Start loading 100px before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, isInView]);
  
  const handleImageChange = useCallback((idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(product.id, idx);
  }, [product.id, onImageChange]);

  const handleClick = useCallback(() => {
    onClick(product);
  }, [product, onClick]);

  return (
    <div className="flex justify-center">
      <div 
        className="relative w-full cursor-pointer group"
        onClick={handleClick}
      >
        {/* Product Card */}
        <div className="relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[420px] overflow-hidden rounded-xl sm:rounded-[15px] bg-stone-200 transition-shadow duration-300 group-hover:shadow-xl touch-manipulation" style={{ transform: 'translateZ(0)' }}>
          {/* Featured Badge - Top Left */}
          {product.is_featured && (
            <div className="absolute top-2 sm:top-2.5 md:top-3 left-2 sm:left-2.5 md:left-3 z-30">
              <span className="inline-block bg-neutral-charcoal text-white text-[10px] sm:text-xs px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-lg">
                {t('products.featured')}
              </span>
            </div>
          )}
          
          {/* Image with smooth transition */}
          <div className="relative w-full h-full overflow-hidden" ref={imgRef} style={{ transform: 'translateZ(0)' }}>
            {isInView && allImages.length > 0 ? (
              <img
                src={allImages[Math.min(currentImageIndex, allImages.length - 1)]}
                alt={product.name}
                className="w-full h-full object-cover will-change-transform"
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                width={400}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.currentTarget;
                  if (!target.src.includes('placeholder')) {
                    target.src = `https://via.placeholder.com/400x400/f5f5f0/8B7355?text=${encodeURIComponent(product.name)}`;
                    setIsLoaded(true);
                  }
                }}
                style={{ 
                  opacity: isLoaded ? 1 : 0, 
                  transition: 'opacity 0.3s ease-out, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ) : (
              <div className="w-full h-full bg-stone-200 animate-pulse" />
            )}
          </div>
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 sm:p-3 md:p-4 transition-opacity duration-300 group-hover:from-black/95" style={{ transform: 'translateZ(0)' }}>
            <div className="overflow-hidden">
              <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg mb-0.5 sm:mb-1 line-clamp-2 transition-transform duration-300 group-hover:translate-y-[-2px]" style={{ willChange: 'transform' }}>
                {extractProductName(product.name)}
              </h3>
              <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 md:mb-2">{product.dimension} • {product.surface}</p>
              {product.price && (
                <p className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-0.5 sm:mb-1 md:mb-2">${product.price}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Image Gallery Dots - only show if there are additional images */}
        {allImages.length > 1 && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex gap-1 sm:gap-1.5 z-20">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleImageChange(idx, e)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 touch-manipulation ${
                  idx === currentImageIndex 
                    ? 'bg-neutral-charcoal w-5 sm:w-6' 
                    : 'bg-white/50 hover:bg-white/80 w-1.5 sm:w-2'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Environment Badge - shown when viewing DECORED images */}
        {currentImageIndex > 0 && (
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-20">
            <span className="bg-neutral-charcoal/90 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full font-medium backdrop-blur-sm">
              {t('products.environmentView')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

