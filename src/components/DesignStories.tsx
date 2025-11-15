import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

const stories = [
  { titleKey: 'stories.residential', descKey: 'stories.residentialDesc', image: `${API_URL}/ALMAS/rico2.jpg` },
  { titleKey: 'stories.commercial', descKey: 'stories.commercialDesc', image: `${API_URL}/ALMAS/victoria.jpg` },
  { titleKey: 'stories.interior', descKey: 'stories.interiorDesc', image: `${API_URL}/ALMAS/ROJINA.jpg` },
];

const DesignStories = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal">DESIGN <strong>STORIES</strong></h2>
            <p className="text-neutral-slate mt-2">{t('stories.subtitle') || 'Inspiration from real-world applications and spaces.'}</p>
          </div>
          <Link to="/projects" className="hidden md:inline text-luxury-gold font-semibold">{t('common.discoverAll') || 'Discover all'}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.article key={s.titleKey} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-neutral-stone/30 bg-card">
              <div className="relative h-[260px]">
                <img src={s.image} alt={t(s.titleKey) || 'Design story'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/80 via-neutral-charcoal/20 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-neutral-charcoal mb-2">{t(s.titleKey) || 'Story'}</h3>
                <p className="text-neutral-slate">{t(s.descKey) || 'High-quality ceramic surfaces designed for modern living.'}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesignStories;


