import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// API URL for backend resources
import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

const BentoShowcase = () => {
  const { t } = useLanguage();
  
  const items = [
    {
      id: 1,
      title: t('bento.iranianExcellence'),
      description: t('bento.discover'),
      image: `getImageUrl('/ALMAS/victoria.jpg')`,
      span: "col-span-2 row-span-2",
      link: "/products",
      gradient: "from-amber-500/20 to-transparent"
    },
    {
      id: 2,
      title: t('bento.years'),
      description: t('bento.yearsDesc'),
      span: "col-span-1 row-span-1",
      link: "/about",
      gradient: "from-blue-500/20 to-transparent",
      stat: true
    },
    {
      id: 3,
      title: t('bento.isoCertified'),
      description: t('bento.isoDesc'),
      image: `getImageUrl('/ALMAS/ROJINA.jpg')`,
      span: "col-span-1 row-span-1",
      link: "/technical",
      gradient: "from-purple-500/20 to-transparent"
    },
    {
      id: 4,
      title: t('bento.globalExport'),
      description: t('bento.globalDesc'),
      span: "col-span-1 row-span-1",
      link: "/about",
      gradient: "from-green-500/20 to-transparent",
      stat: true
    },
    {
      id: 5,
      title: t('bento.factory'),
      description: t('bento.factoryDesc'),
      image: `getImageUrl('/ALMAS/PORPJA.jpg')`,
      span: "col-span-1 row-span-1",
      link: "/contact",
      gradient: "from-red-500/20 to-transparent"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-neutral-charcoal mb-3 sm:mb-4 md:mb-5 lg:mb-6 tracking-tight">
            {t('bento.experience')}
            <br />
            <span className="bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent">
              {t('bento.theDifference')}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-slate max-w-2xl">
            {t('bento.description')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px]">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${item.span} group relative overflow-hidden rounded-3xl bg-card border border-neutral-stone/20 hover:border-luxury-gold/30 transition-all duration-500 cursor-pointer`}
            >
              <Link to={item.link} className="block h-full">
                {/* Background Image or Gradient */}
                {item.image ? (
                  <div className="absolute inset-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/90 via-neutral-charcoal/40 to-transparent" />
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                )}

                {/* Content */}
                <div className="relative h-full p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between">
                  {item.stat && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-luxury-gold to-luxury-bronze bg-clip-text text-transparent mb-1 sm:mb-1.5 md:mb-2">
                          {item.title.split(' ')[0]}
                        </div>
                        <div className="text-neutral-charcoal font-semibold text-sm sm:text-base md:text-lg">
                          {item.title.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={item.stat ? "" : "flex-1 flex flex-col justify-end"}>
                    {!item.stat && (
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-background mb-1.5 sm:mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                    )}
                    <p className={`${item.stat ? 'text-neutral-charcoal' : 'text-neutral-linen'} text-xs sm:text-sm md:text-base mb-3 sm:mb-3.5 md:mb-4`}>
                      {item.description}
                    </p>
                    
                    {/* Arrow Icon */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className={`${item.stat ? 'text-neutral-charcoal' : 'text-luxury-gold'} text-xs sm:text-sm font-semibold uppercase tracking-wider`}>
                        {t('bento.explore')}
                      </span>
                      <ArrowUpRight className={`${item.stat ? 'text-neutral-charcoal' : 'text-luxury-gold'} w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300`} />
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 border-2 border-luxury-gold/0 group-hover:border-luxury-gold/50 rounded-3xl transition-all duration-500 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoShowcase;
