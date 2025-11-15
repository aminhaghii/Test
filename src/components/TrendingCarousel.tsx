import { useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Flame } from "lucide-react";
import collectionWood from "@/assets/collection-wood-look.jpg";
import collectionMarble from "@/assets/collection-marble.jpg";
import collectionConcrete from "@/assets/collection-concrete.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const trendingCollections = [
  {
    id: 1,
    name: "Calacatta Oro Supreme",
    category: "Marble Luxury",
    image: collectionMarble,
    views: "2,847",
    products: 24,
    finishes: 8,
    formats: 5,
    previews: [collectionMarble, collectionMarble, collectionMarble, collectionMarble],
  },
  {
    id: 2,
    name: "Heritage Oak Collection",
    category: "Wood Look Excellence",
    image: collectionWood,
    views: "2,134",
    products: 18,
    finishes: 6,
    formats: 4,
    previews: [collectionWood, collectionWood, collectionWood, collectionWood],
  },
  {
    id: 3,
    name: "Urban Concrete Series",
    category: "Industrial Modern",
    image: collectionConcrete,
    views: "1,928",
    products: 15,
    finishes: 5,
    formats: 3,
    previews: [collectionConcrete, collectionConcrete, collectionConcrete, collectionConcrete],
  },
  {
    id: 4,
    name: "Travertino Navona",
    category: "Stone Natural",
    image: collectionMarble,
    views: "1,756",
    products: 20,
    finishes: 7,
    formats: 4,
    previews: [collectionMarble, collectionMarble, collectionMarble, collectionMarble],
  },
  {
    id: 5,
    name: "Metropolitan Slate",
    category: "Contemporary Stone",
    image: collectionConcrete,
    views: "1,623",
    products: 16,
    finishes: 6,
    formats: 3,
    previews: [collectionConcrete, collectionConcrete, collectionConcrete, collectionConcrete],
  },
];

const TrendingCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { elementRef, isVisible } = useScrollReveal();

  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disableMotion = isTouch || prefersReducedMotion;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 468; // Card width (440px) + gap (28px)
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 lg:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div
          ref={elementRef}
          className={`mb-14 transition-all ${disableMotion ? '' : 'duration-1000'} ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="mb-4">
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              Trending Now
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-[56px] font-semibold text-neutral-charcoal mb-5 tracking-tight">
            Most Viewed Collections This Month
          </h2>
          <p className="text-lg text-neutral-slate max-w-3xl">
            Discover what leading architects and interior designers are specifying
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Edge Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-[52px] h-[52px] rounded-full bg-background border-2 border-border shadow-elegant flex items-center justify-center transition-elegant hover:bg-luxury-gold hover:border-luxury-gold hover:scale-108 group"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5.5 h-5.5 text-neutral-charcoal group-hover:text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-[52px] h-[52px] rounded-full bg-background border-2 border-border shadow-elegant flex items-center justify-center transition-elegant hover:bg-luxury-gold hover:border-luxury-gold hover:scale-108 group"
          aria-label="Next"
        >
          <ChevronRight className="w-5.5 h-5.5 text-neutral-charcoal group-hover:text-foreground" />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7 overflow-x-auto px-4 sm:px-5 md:px-6 lg:px-20 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-luxury-gold scrollbar-track-luxury-gold/30 -webkit-overflow-scrolling-touch touch-pan-x"
          style={{ scrollbarGutter: "stable" }}
        >
          {trendingCollections.map((collection, index) => (
            <div
              key={collection.id}
              className={`flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[440px] snap-start group ${disableMotion ? '' : 'animate-fade-in-up'}`}
              style={disableMotion ? undefined : { animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-background rounded-[14px] overflow-hidden shadow-elegant transition-elegant hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)] hover:scale-103">
                {/* Image Section */}
                <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[380px] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-elegant group-hover:scale-107"
                    loading="lazy"
                    decoding="async"
                    width={440}
                    height={380}
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 440px"
                  />

                  {/* Trending Badge */}
                  <div className={`absolute top-4.5 left-4.5 flex items-center gap-2 bg-luxury-gold/96 ${isTouch ? '' : 'backdrop-blur-sm'} px-4.5 py-2.5 rounded-3xl shadow-elegant`}>
                    <Flame className="w-4.5 h-4.5 text-background" />
                    <span className="font-technical text-[11px] font-semibold uppercase tracking-wider text-background">
                      Trending
                    </span>
                  </div>

                  {/* View Stats */}
                  <div className={`absolute bottom-4.5 right-4.5 flex items-center gap-2 bg-neutral-charcoal/75 ${isTouch ? '' : 'backdrop-blur-md'} px-4 py-2 rounded-2xl`}>
                    <Eye className="w-4 h-4 text-background" />
                    <span className="font-sans text-[13px] font-medium text-background">
                      {collection.views} views
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-5 md:p-6 lg:p-6.5">
                  <h3 className="font-sans text-lg sm:text-xl md:text-[21px] lg:text-[23px] font-semibold text-neutral-charcoal mb-2 sm:mb-2.5">
                    {collection.name}
                  </h3>
                  <p className="font-technical text-[10px] sm:text-xs uppercase text-neutral-slate tracking-wide mb-2.5 sm:mb-3 md:mb-3.5">
                    {collection.category}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-4.5 text-xs sm:text-[12px] md:text-[13px] text-neutral-stone">
                    <span>{collection.products} Products</span>
                    <span className="text-neutral-stone/50">•</span>
                    <span>{collection.finishes} Finishes</span>
                    <span className="text-neutral-stone/50">•</span>
                    <span>{collection.formats} Formats</span>
                  </div>

                  {/* Mini Preview (appears on hover) */}
                  <div className={`mt-4.5 grid grid-cols-4 gap-1.5 ${disableMotion ? '' : 'opacity-0 group-hover:opacity-100 transition-elegant'}`}>
                    {collection.previews.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className={`w-full aspect-square object-cover rounded-md ${disableMotion ? '' : 'animate-scale-in'}`}
                        style={disableMotion ? undefined : { animationDelay: `${idx * 0.05}s` }}
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={96}
                        sizes="(max-width: 640px) 20vw, 96px"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
