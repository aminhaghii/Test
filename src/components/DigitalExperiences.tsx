import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DigitalExperiences = () => {
  const { t } = useLanguage();

  const cards = [
    { title: t('digital.visualizer') || '3D Room Visualizer', desc: t('digital.visualizerDesc') || 'Design your space and preview tiles in real-time.', to: '/inspiration' },
    { title: t('digital.catalog') || 'Product Catalog', desc: t('digital.catalogDesc') || 'Browse and download our latest catalogues.', to: '/catalogues' },
    { title: t('digital.showroom') || 'Virtual Showroom Tour', desc: t('digital.showroomDesc') || 'Take a digital tour of our showroom.', to: '/about' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-neutral-charcoal font-bold mb-3">DIGITAL PRODUCT <strong>EXPERIENCES</strong></h2>
          <p className="text-base md:text-lg text-neutral-slate">
            Explore our digital tools and resources
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {cards.map((c, i) => (
            <motion.div 
              key={c.title} 
              initial={{ opacity: 0, y: 24 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: i * 0.1 }} 
              viewport={{ once: true, margin: "-50px" }}
              className="group rounded-2xl border border-neutral-stone/30 p-6 bg-card transition-all duration-300 hover:shadow-lg hover:border-neutral-stone/50 hover:-translate-y-1"
            >
              <h3 className="font-display text-xl font-bold text-neutral-charcoal mb-2">{c.title}</h3>
              <p className="text-neutral-slate mb-4">{c.desc}</p>
              <Link to={c.to} className="inline-flex items-center gap-2 text-neutral-charcoal font-semibold transition-colors hover:text-neutral-charcoal/80 group-hover:gap-3">
                {t('common.explore') || 'Explore'} 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalExperiences;


