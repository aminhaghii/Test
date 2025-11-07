import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type CollectionCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isNew?: boolean;
  span?: 'wide';
};

const Collections = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const cards: CollectionCard[] = [
    {
      id: 'surfaces',
      title: 'Creative Concrete P',
      subtitle: t('common.surfacesSub') || 'Premium ceramic surfaces inspired by natural colors and textures',
      image: `${API_URL}/ALMAS/505d109c-c3ce-42ef-8cc1-9499265a2d7d.png`,
      link: '/products',
      isNew: true,
      span: 'wide',
    },
    {
      id: 'big-slabs',
      title: 'Creative Concrete P Brick',
      subtitle: t('common.bigSlabsSub') || 'Large-format porcelain slabs for seamless, modern spaces',
      image: `${API_URL}/ALMAS/08c067af-77ef-48f5-a51a-2fe5256da93e.png`,
      link: '/products?dimension=60x120',
      isNew: true,
    },
    {
      id: 'bathroom-kitchen',
      title: 'Creative Concrete P Stone',
      subtitle: t('common.bathKitchenSub') || 'Designer bathroom and kitchen tile collections crafted for everyday living',
      image: `${API_URL}/ALMAS/f65620a0-45d0-411c-bc06-fa01ae497157.png`,
      link: '/products?openFilter=material',
      isNew: true,
    },
    {
      id: 'crystal-white',
      title: 'Crystal White',
      subtitle: 'Marble-inspired surfaces with crystalline clarity for luminous interiors.',
      image: `${API_URL}/ALMAS/eb3303f6-b8bf-4221-adb1-7a883c17c666.png`,
      link: '/products',
    },
    {
      id: 'maximus-granito',
      title: 'Maximus Granito White Andes',
      subtitle: 'Large-format slabs with the timeless elegance of natural stone.',
      image: `${API_URL}/ALMAS/victoria.jpg`,
      link: '/products?dimension=80x80',
      isNew: true,
    },
    {
      id: 'moon-stone',
      title: 'Moon Stone',
      subtitle: 'Outdoor-ready porcelain surfaces with refined textures and neutral palettes.',
      image: `${API_URL}/ALMAS/rico.jpg`,
      link: '/products',
    },
    {
      id: 'maximus-grey',
      title: 'Maximus Grey Antique',
      subtitle: 'Award-winning veined marble designs for statement kitchens and hospitality spaces.',
      image: `${API_URL}/ALMAS/PORPJA.jpg`,
      link: '/products?dimension=100x100',
    },
    {
      id: 'marakkesh',
      title: 'Marakkesh',
      subtitle: 'Glazed wall tiles celebrating color, geometry, and handcrafted character.',
      image: `${API_URL}/ALMAS/ROJINA.jpg`,
      link: '/products?openFilter=material',
      isNew: true,
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

  const heroLinks = cards.slice(0, 3);

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
          <nav className="mt-8 flex flex-wrap gap-3 text-sm font-semibold uppercase">
            {heroLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-5 py-2 border border-neutral-200 hover:border-neutral-400 transition-colors text-neutral-charcoal"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <Link
              key={card.id}
              id={card.id}
              to={card.link}
              className={`group relative h-[280px] md:h-[320px] lg:h-[360px] ${
                card.span === 'wide' ? 'lg:col-span-2 lg:h-[360px]' : ''
              }`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity" />
              {card.isNew && (
                <span className="absolute top-4 right-4 bg-white text-neutral-charcoal text-xs font-semibold px-3 py-1 uppercase tracking-[0.2em]">
                  New
                </span>
              )}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight">
                  {card.title}
                </h2>
                <p className="text-sm md:text-base text-white/85 leading-relaxed mt-3 max-w-xl">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Collections;


