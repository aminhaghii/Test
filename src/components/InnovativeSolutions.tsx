import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

// basePanels will be created dynamically using translations

const textureFiles = [
  "ALMAS/100 100/Polished/VELASKA DARK GRAY (3).jpg",
  "ALMAS/60x60/Trans/PARMA WHITE (4).jpg",
  "ALMAS/40x100/DOMINI BROWN (8).jpg",
];

const InnovativeSolutions = () => {
  const { t } = useLanguage();

  const textureUrls = useMemo(
    () =>
      textureFiles.map((path) =>
        `${API_URL}/${path.split("/").map(encodeURIComponent).join("/")}`
      ),
    []
  );

  const randomizedTextures = useMemo(() => {
    const shuffled = [...textureUrls];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [textureUrls]);

  const basePanels = useMemo(() => [
    {
      title: t('innovativeSolutions.panels.isoCertified.title'),
      subtitle: t('innovativeSolutions.panels.isoCertified.subtitle'),
    },
    {
      title: t('innovativeSolutions.panels.environmental.title'),
      subtitle: t('innovativeSolutions.panels.environmental.subtitle'),
    },
    {
      title: t('innovativeSolutions.panels.global.title'),
      subtitle: t('innovativeSolutions.panels.global.subtitle'),
    },
  ], [t]);

  const panels = useMemo(
    () =>
      basePanels.map((panel, index) => ({
        ...panel,
        image: randomizedTextures[index % randomizedTextures.length],
      })),
    [basePanels, randomizedTextures]
  );

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-[1800px]">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_2fr] gap-6 lg:gap-10 items-center">
          {/* Left Section - Image Panels (now wider) */}
          <div className="order-2 lg:order-1 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {panels.map((panel, i) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] rounded-2xl overflow-hidden">
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                    loading="lazy"
                  />
                  {/* Overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-charcoal/90 via-neutral-charcoal/50 to-transparent p-3 sm:p-4 md:p-5 lg:p-6">
                    <div className="text-white">
                      <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 opacity-90">
                        {panel.subtitle}
                      </div>
                      <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                        {panel.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Text (moved to the right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 lg:max-w-md lg:ml-auto text-left lg:text-right"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight text-neutral-charcoal mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              {t('innovativeSolutions.title')}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-slate leading-relaxed">
              {t('innovativeSolutions.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InnovativeSolutions;


