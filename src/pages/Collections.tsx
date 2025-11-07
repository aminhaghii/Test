import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Card = {
  title: string;
  subtitle: string;
  image: string;
  to: string;
};

const Collections = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const sections: Card[] = [
    {
      title: t('common.surfaces') || 'Surfaces',
      subtitle: t('common.surfacesSub') || 'Premium ceramic surfaces inspired by natural colors and textures',
      image: `${API_URL}/ALMAS/victoria.jpg`,
      to: '/products',
    },
    {
      title: t('common.bigSlabs') || 'Big slabs',
      subtitle: t('common.bigSlabsSub') || 'Large-format porcelain slabs for seamless, modern spaces',
      image: `${API_URL}/ALMAS/PORPJA.jpg`,
      to: '/products?dimension=60x120',
    },
    {
      title: t('common.bathKitchen') || 'Bathroom & kitchen',
      subtitle: t('common.bathKitchenSub') || 'Designer bathroom and kitchen tile collections crafted for everyday living',
      image: `${API_URL}/ALMAS/ROJINA.jpg`,
      to: '/products?openFilter=material',
    },
  ];

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 lg:px-20 max-w-[1600px] py-12 lg:py-20">
        <header className="mb-14">
          <p className="uppercase tracking-[0.35em] text-xs font-semibold text-neutral-500 mb-3">
            {t('common.lifestyleSolutions') || 'Lifestyle Solutions'}
          </p>
          <h1 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal font-bold mb-4">
            {t('collections.featured') || 'Collections'}
          </h1>
          <p className="text-neutral-slate max-w-3xl">
            {t('collections.description') || 'Create inspiring interiors with premium porcelain and ceramic tile collections for indoor and outdoor, residential and commercial projects.'}
          </p>
          <nav className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
            {sections.map((section) => (
              <a key={section.title} href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors text-neutral-charcoal">
                {section.title}
              </a>
            ))}
          </nav>
        </header>

        <div className="space-y-10 lg:space-y-16">
          {sections.map((section, index) => {
            const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const isEven = index % 2 === 1;
            return (
              <article key={section.title} id={id} className="relative overflow-hidden rounded-3xl bg-neutral-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className={`relative h-[320px] lg:h-[420px] ${isEven ? 'order-last lg:order-first' : ''}`}>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <div className={`p-8 lg:p-12 flex flex-col justify-center ${isEven ? 'lg:items-start' : 'lg:items-start'}`}>
                    <h2 className="text-neutral-charcoal text-2xl lg:text-3xl font-bold mb-3 uppercase">
                      {section.title}
                    </h2>
                    <p className="text-neutral-slate text-base lg:text-lg leading-relaxed mb-6 max-w-xl">
                      {section.subtitle}
                    </p>
                    <Link
                      to={section.to}
                      className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold hover:text-luxury-gold transition-colors"
                    >
                      {t('common.viewAll') || 'View All'}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Collections;


