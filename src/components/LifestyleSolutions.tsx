import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getApiUrl } from '@/lib/getApiUrl';

import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

type Card = { title: string; subtitle: string; image: string; to: string };

const decorBase = `${API_URL}/DECORED`;
const withPath = (path: string) => `${decorBase}/${path.split('/').map(segment => encodeURIComponent(segment)).join('/')}`;

const LifestyleSolutions = () => {
  const { t } = useLanguage();

  const cards: Card[] = [
    {
      title: t('lifestyleSolutions.cards.lobbySerenity.title'),
      subtitle: t('lifestyleSolutions.cards.lobbySerenity.subtitle'),
      image: withPath("30x90/alvin2.jpg"),
      to: '/products?dimension=30x90',
    },
    {
      title: t('lifestyleSolutions.cards.signatureBathSuite.title'),
      subtitle: t('lifestyleSolutions.cards.signatureBathSuite.subtitle'),
      image: withPath("60X120/SOUFIA.jpg"),
      to: '/products?dimension=60x120',
    },
    {
      title: t('lifestyleSolutions.cards.gourmetStudio.title'),
      subtitle: t('lifestyleSolutions.cards.gourmetStudio.subtitle'),
      image: withPath("30x90/alvin3.jpg"),
      to: '/products?dimension=30x90&space=kitchen',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-neutral-charcoal font-bold mb-3">
            {t('lifestyleSolutions.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-slate">
            {t('lifestyleSolutions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative overflow-hidden bg-white"
            >
              <Link
                to={card.to}
                className="block"
              >
                {/* Image takes top 2/3 */}
                <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" 
                    loading="lazy" 
                  />
                </div>
                {/* Text area takes bottom 1/3 */}
                <div className="bg-white p-4 sm:p-5 md:p-6 text-center">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase text-neutral-charcoal mb-2">
                    {card.title}
                  </h3>
                  <p className="text-neutral-slate text-xs sm:text-sm md:text-base mb-3">
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


