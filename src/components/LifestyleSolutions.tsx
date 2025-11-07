import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Card = { title: string; subtitle: string; image: string; to: string };

const LifestyleSolutions = () => {
  const { t } = useLanguage();

  const cards: Card[] = [
    {
      title: t('common.surfaces') || 'Surfaces',
      subtitle: t('common.surfacesSub') || 'Premium ceramic surfaces inspired by natural colors and textures',
      image: `${API_URL}/ALMAS/victoria.jpg`,
      to: '/collections#surfaces',
    },
    {
      title: t('common.bigSlabs') || 'Big slabs',
      subtitle: t('common.bigSlabsSub') || 'Large-format porcelain slabs for seamless, modern spaces',
      image: `${API_URL}/ALMAS/PORPJA.jpg`,
      to: '/collections#big-slabs',
    },
    {
      title: t('common.bathKitchen') || 'Bathroom & kitchen',
      subtitle: t('common.bathKitchenSub') || 'Designer bathroom and kitchen tile collections crafted for everyday living',
      image: `${API_URL}/ALMAS/ROJINA.jpg`,
      to: '/collections#bathroom-kitchen',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal font-bold">
            LIFESTYLE <strong>SOLUTIONS</strong>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden bg-white"
            >
              <Link to={card.to} className="block">
                {/* Image takes top 2/3 */}
                <div className="relative h-[400px] md:h-[500px]">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                  />
                </div>
                {/* Text area takes bottom 1/3 */}
                <div className="bg-white p-6 text-center">
                  <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-neutral-charcoal mb-2">
                    {card.title}
                  </h3>
                  <p className="text-neutral-slate text-sm md:text-base">
                    {card.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSolutions;


