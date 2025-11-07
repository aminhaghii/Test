import { Link } from "react-router-dom";
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

  const cards: Card[] = [
    {
      title: t('common.surfaces') || 'Surfaces',
      subtitle: t('common.surfacesSub') || 'Premium ceramic surfaces inspired by natural colors and textures',
      image: `${API_URL}/ALMAS/victoria.jpg`,
      to: '/products',
    },
    {
      title: t('common.bathKitchen') || 'Bathroom & kitchen',
      subtitle: t('common.bathKitchenSub') || 'Designer bathroom and kitchen tile collections crafted for everyday living',
      image: `${API_URL}/ALMAS/ROJINA.jpg`,
      to: '/products?openFilter=material',
    },
    {
      title: t('common.bigSlabs') || 'Big slabs',
      subtitle: t('common.bigSlabsSub') || 'Large-format porcelain slabs for seamless, modern spaces',
      image: `${API_URL}/ALMAS/PORPJA.jpg`,
      to: '/products?dimension=60x120',
    },
    {
      title: t('common.signature') || 'Signature collections',
      subtitle: t('common.signatureSub') || 'Capturing the essence of luxury',
      image: `${API_URL}/ALMAS/ROJINA.jpg`,
      to: '/inspiration',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 lg:px-20 max-w-[1600px] py-12 lg:py-20">
        <header className="mb-10 lg:mb-14">
          <h1 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal font-bold mb-3">
            {t('collections.featured') || 'Collections'}
          </h1>
          <p className="text-neutral-slate max-w-3xl">
            Create inspiring interiors with premium porcelain and ceramic tile collections for indoor and outdoor, residential and commercial projects.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className="group relative rounded-2xl overflow-hidden bg-neutral-100">
              <img src={card.image} alt={card.title} className="w-full h-[320px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                <h2 className="text-white text-2xl lg:text-3xl font-bold mb-2 group-hover:text-luxury-gold transition-colors">
                  {card.title}
                </h2>
                <p className="text-white/90 text-base lg:text-lg max-w-2xl">
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


