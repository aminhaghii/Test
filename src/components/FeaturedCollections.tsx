import { useState } from "react";
import { Button } from "@/components/ui/button";
import collectionWood from "@/assets/collection-wood-look.jpg";
import collectionMarble from "@/assets/collection-marble.jpg";
import collectionConcrete from "@/assets/collection-concrete.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedCollections = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState(t('featuredCollections.filterAll'));
  
  const filters = [
    t('featuredCollections.filterAll'),
    t('featuredCollections.filterWoodLook'),
    t('featuredCollections.filterMarbleLook'),
    t('featuredCollections.filterStoneLook'),
    t('featuredCollections.filterConcrete'),
    t('featuredCollections.filterMetalEffect')
  ];
  
  const collections = [
    {
      id: 1,
      name: t('featuredCollections.collection1Name'),
      category: t('featuredCollections.collection1Category'),
      image: collectionWood,
      description: t('featuredCollections.collection1Description'),
      products: 22,
      finishes: 6,
      badge: t('featuredCollections.badgeNew'),
    },
    {
      id: 2,
      name: t('featuredCollections.collection2Name'),
      category: t('featuredCollections.collection2Category'),
      image: collectionMarble,
      description: t('featuredCollections.collection2Description'),
      products: 18,
      finishes: 5,
      badge: t('featuredCollections.badgeBestseller'),
    },
    {
      id: 3,
      name: t('featuredCollections.collection3Name'),
      category: t('featuredCollections.collection3Category'),
      image: collectionConcrete,
      description: t('featuredCollections.collection3Description'),
      products: 15,
      finishes: 4,
      badge: null,
    },
  ];
  
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="collections" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div
          ref={elementRef}
          className={`text-center mb-16 lg:mb-20 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="mb-4">
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {t('featuredCollections.label')}
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-neutral-charcoal mb-6 tracking-tight">
            {t('featuredCollections.title')}
          </h2>
          <p className="text-lg lg:text-xl text-neutral-slate leading-relaxed">
            {t('featuredCollections.subtitle')}
          </p>
        </div>

        {/* Filter System */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-9 mb-14 lg:mb-16">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[15px] font-medium tracking-wide py-3 border-b-[3px] transition-elegant ${
                activeFilter === filter
                  ? "border-luxury-gold text-neutral-charcoal font-semibold"
                  : "border-transparent text-neutral-slate hover:text-neutral-graphite hover:border-luxury-gold/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-9">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Card Container */}
              <div className="bg-card rounded-[14px] overflow-hidden shadow-card hover:shadow-card-hover transition-elegant hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-elegant group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 gradient-card-elegance opacity-0 group-hover:opacity-100 transition-elegant flex flex-col justify-end p-9">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-elegant opacity-0 group-hover:opacity-100">
                      <h3 className="font-sans text-[26px] font-semibold text-background mb-2">
                        {collection.name}
                      </h3>
                      <p className="font-technical text-xs uppercase tracking-widest text-luxury-gold mb-2">
                        {collection.category}
                      </p>
                      <p className="text-sm text-background/85 mb-5">
                        {collection.products} {t('featuredCollections.products')} • {collection.finishes} {t('featuredCollections.finishes')}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 border-background text-background hover:bg-background hover:text-foreground rounded-full px-7 transition-smooth"
                      >
                        {t('featuredCollections.viewCollection')}
                      </Button>
                    </div>
                  </div>

                  {/* Badge */}
                  {collection.badge && (
                    <div className="absolute top-4 right-4 bg-luxury-gold text-foreground text-[11px] font-technical font-semibold uppercase tracking-widest px-[18px] py-[7px] rounded-[14px] shadow-elegant">
                      {collection.badge}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-7">
                  <h3 className="font-sans text-[23px] font-semibold text-neutral-charcoal mb-2">
                    {collection.name}
                  </h3>
                  <p className="font-technical text-[11px] uppercase tracking-widest text-neutral-slate mb-3">
                    {collection.category}
                  </p>
                  <p className="text-sm text-neutral-slate leading-relaxed line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
