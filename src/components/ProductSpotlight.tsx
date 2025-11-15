import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getApiUrl } from '@/lib/getApiUrl';

import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

type Tile = {
  title: string;
  image: string;
  to: string;
  description: string;
  width: string;
  height: string;
  textPosition: 'top' | 'bottom';
};

const decorPath = (path: string) =>
  getImageUrl(`/DECORED/${path.split('/').map(segment => encodeURIComponent(segment)).join('/')}`);

// tiles will be created dynamically using translations

const ProductSpotlight = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const tiles: Tile[] = [
    { title: t('productSpotlight.tiles.alvinSilver.title'), image: decorPath('30x90/alvin2.jpg'), to: '/products?dimension=30x90', description: t('productSpotlight.tiles.alvinSilver.description'), width: '540px', height: '480px', textPosition: 'bottom' },
    { title: t('productSpotlight.tiles.soufiaSand.title'), image: decorPath('60X120/SOUFIA2.jpg'), to: '/products?dimension=60x120', description: t('productSpotlight.tiles.soufiaSand.description'), width: '520px', height: '460px', textPosition: 'top' },
    { title: t('productSpotlight.tiles.rakuStone.title'), image: decorPath('60X120/RAKU 4MATCH.jpg'), to: '/products?dimension=60x120', description: t('productSpotlight.tiles.rakuStone.description'), width: '610px', height: '560px', textPosition: 'bottom' },
    { title: t('productSpotlight.tiles.klaraGrey.title'), image: decorPath('60X120/klara 3.jpg'), to: '/products?dimension=60x120', description: t('productSpotlight.tiles.klaraGrey.description'), width: '520px', height: '460px', textPosition: 'top' },
    { title: t('productSpotlight.tiles.waldoMatt.title'), image: decorPath('60X120/waldo matt.jpg'), to: '/products?dimension=60x120&surface=Matt', description: t('productSpotlight.tiles.waldoMatt.description'), width: '570px', height: '520px', textPosition: 'bottom' },
  ];

  // Calculate responsive scroll amount based on viewport
  const getScrollAmount = () => {
    if (typeof window === 'undefined') return 560;
    const width = window.innerWidth;
    if (width < 640) return width * 0.85; // Mobile: 85% of viewport
    if (width < 1024) return width * 0.6; // Tablet: 60% of viewport
    return 560; // Desktop: fixed amount
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-neutral-charcoal font-bold mb-3">
            {t('productSpotlight.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-slate">
            {t('common.productSpotlightDesc') || 'Suitable for sophisticated interior furnishings and worktops'}
          </p>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl"
              aria-label={t('productSpotlight.scrollLeft')}
            >
              <ChevronLeft className="w-6 h-6 text-neutral-charcoal" />
            </button>
          )}

          {/* Scroll Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100/50 z-0">
            <div 
              className="h-full bg-neutral-charcoal transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
          >
            {tiles.map((item, i) => (
              <div 
                key={item.title} 
                className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[540px]"
                style={{ 
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 ? item.width : undefined,
                  minWidth: typeof window !== 'undefined' && window.innerWidth >= 768 ? item.width : undefined
                }}
              >
                <Link
                to={item.to}
                  className="block group/card flex flex-col"
                >
                  {/* Text above image (if textPosition is top) */}
                  {item.textPosition === 'top' && (
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-neutral-charcoal">
                        {item.title}
                      </h3>
                      <p className="text-neutral-slate text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold group-hover/card:text-neutral-charcoal/80 transition-colors">
                        {t('common.readMore') || 'Read more'} <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                      </span>
                      <span className="block text-xs uppercase tracking-[0.32em] text-neutral-charcoal/60">
                        {item.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Image - different sizes */}
                  <div 
                    className="relative w-full overflow-hidden bg-neutral-100"
                    style={{ 
                      height: typeof window !== 'undefined' && window.innerWidth >= 768 ? item.height : 'auto',
                      aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '4/3' : undefined
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105 will-change-transform"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Text below image (if textPosition is bottom) */}
                  {item.textPosition === 'bottom' && (
                    <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-neutral-charcoal">
                        {item.title}
                      </h3>
                      <p className="text-neutral-slate text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold group-hover/card:text-neutral-charcoal/80 transition-colors">
                        {t('common.readMore') || 'Read more'} <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                      </span>
                      <span className="block text-xs uppercase tracking-[0.32em] text-neutral-charcoal/60">
                        {item.title}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl"
              aria-label={t('productSpotlight.scrollRight')}
            >
              <ChevronRight className="w-6 h-6 text-neutral-charcoal" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSpotlight;


