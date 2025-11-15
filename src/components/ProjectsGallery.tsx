import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

const images = [
  `${API_URL}/ALMAS/victoria.jpg`,
  `${API_URL}/ALMAS/ROJINA.jpg`,
  `${API_URL}/ALMAS/PORPJA.jpg`,
  `${API_URL}/ALMAS/rico.jpg`,
  `${API_URL}/ALMAS/rico2.jpg`,
  `${API_URL}/ALMAS/victoria.jpg`,
];

const ProjectsGallery = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight text-neutral-charcoal">Our latest projects</h2>
            <p className="text-neutral-slate mt-2">{t('projects.subtitle') || 'Selected installations and reference spaces.'}</p>
          </div>
          <Link to="/projects" className="hidden md:inline text-luxury-gold font-semibold">{t('common.viewAll') || 'View all'}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <motion.div key={src + i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.05 }} viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-neutral-stone/30 bg-card">
              <div className="relative h-[240px]">
                <img src={src} alt="Project" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/70 via-neutral-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGallery;


