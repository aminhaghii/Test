import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsMarquee = () => {
  const { t } = useLanguage();
  
  const stats = [
    { value: "60+", label: t('stats.yearsExperience') },
    { value: "15K+", label: t('stats.projectsCompleted') },
    { value: "85+", label: t('stats.countries') },
    { value: "98%", label: t('stats.clientSatisfaction') },
    { value: "50M+", label: t('stats.sqmProduction') },
    { value: "42+", label: t('stats.designAwards') },
  ];

  // Duplicate for seamless loop
  const duplicatedStats = [...stats, ...stats];

  return (
    <section className="py-16 bg-neutral-charcoal overflow-hidden relative">
      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-charcoal to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-charcoal to-transparent z-10" />

      {/* Marquee Container */}
      <div className="relative">
        <motion.div
          className="flex gap-16"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-16 flex-shrink-0"
            >
              {/* Stat Item */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-display text-5xl lg:text-6xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="font-technical text-sm uppercase tracking-wider text-neutral-linen">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="w-px h-16 bg-luxury-gold/20" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsMarquee;
