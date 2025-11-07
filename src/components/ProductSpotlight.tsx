import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Tile = {
  title: string;
  image: string;
  to: string;
  desc: string;
  width: string;
  height: string;
  textPosition: 'top' | 'bottom';
};

const tiles: Tile[] = [
  { title: 'Victoria', image: `${API_URL}/ALMAS/victoria.jpg`, to: '/products', desc: 'Suitable for sophisticated interior furnishings and worktops', width: '550px', height: '500px', textPosition: 'bottom' },
  { title: 'Rojina', image: `${API_URL}/ALMAS/ROJINA.jpg`, to: '/products', desc: 'Premium ceramic surfaces for modern living spaces', width: '480px', height: '450px', textPosition: 'top' },
  { title: 'Factory Collection', image: `${API_URL}/ALMAS/PORPJA.jpg`, to: '/products', desc: 'Large-format porcelain slabs for seamless, modern spaces', width: '620px', height: '580px', textPosition: 'bottom' },
  { title: 'Rico', image: `${API_URL}/ALMAS/rico.jpg`, to: '/products', desc: 'Elegant patterns for contemporary design', width: '500px', height: '480px', textPosition: 'top' },
  { title: 'Rico 2', image: `${API_URL}/ALMAS/rico2.jpg`, to: '/products', desc: 'Luxury meets ceramic expertise', width: '570px', height: '520px', textPosition: 'bottom' },
];

const ProductSpotlight = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 560; // Average card width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal font-bold mb-2">
            PRODUCT <strong>SPOTLIGHT</strong>
          </h2>
          <p className="text-neutral-slate">
            {t('common.productSpotlightDesc') || 'Suitable for sophisticated interior furnishings and worktops'}
          </p>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-charcoal" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {tiles.map((item, i) => (
              <div 
                key={item.title} 
                className="flex-shrink-0"
                style={{ width: item.width }}
              >
                <Link to={item.to} className="block group/card flex flex-col">
                  {/* Text above image (if textPosition is top) */}
                  {item.textPosition === 'top' && (
                    <div className="space-y-3 mb-6">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-neutral-charcoal">
                        {item.title}
                      </h3>
                      <p className="text-neutral-slate text-base leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold group-hover/card:text-luxury-gold transition-colors">
                        {t('common.readMore') || 'Read more'} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                  
                  {/* Image - different sizes */}
                  <div 
                    className="relative w-full overflow-hidden bg-neutral-100"
                    style={{ height: item.height }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Text below image (if textPosition is bottom) */}
                  {item.textPosition === 'bottom' && (
                    <div className="space-y-3 mt-6">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-neutral-charcoal">
                        {item.title}
                      </h3>
                      <p className="text-neutral-slate text-base leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold group-hover/card:text-luxury-gold transition-colors">
                        {t('common.readMore') || 'Read more'} <ArrowRight className="w-4 h-4" />
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
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


