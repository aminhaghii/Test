import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// API URL for backend resources
import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

const ImageTextSplit = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  
  const features = [
    t('imageTextSplit.feature1'),
    t('imageTextSplit.feature2'),
    t('imageTextSplit.feature3'),
    t('imageTextSplit.feature4'),
    t('imageTextSplit.feature5'),
    t('imageTextSplit.feature6'),
  ];

  return (
    <section ref={containerRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-b from-background via-neutral-alabaster to-background overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-luxury-bronze/10 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Image Side with Parallax */}
          <motion.div 
            style={{ y: imageY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={`${API_URL}/ALMAS/victoria.jpg`}
                  alt="Luxury ceramic installation"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/50 to-transparent" />
              </div>

              {/* Floating Card */}

              {/* Decorative Shape */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-luxury-gold/20 rounded-3xl -z-10" />
            </motion.div>
          </motion.div>

          {/* Text Side with Parallax */}
          <motion.div 
            style={{ y: textY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-luxury-gold" />
                <span className="font-technical text-xs uppercase tracking-wider text-luxury-gold font-semibold">
                  {t('imageTextSplit.label')}
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-charcoal mb-4 sm:mb-5 md:mb-6 leading-tight tracking-tight">
                {t('imageTextSplit.title')}
                <br />
                <span className="bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent">
                  {t('imageTextSplit.titleHighlight')}
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-slate leading-relaxed mb-6 sm:mb-7 md:mb-8">
                {t('imageTextSplit.description')}
              </p>

              {/* Features List */}
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-9 md:mb-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-luxury-gold" />
                    </div>
                    <span className="text-sm sm:text-base text-neutral-charcoal font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link to="/about" className="w-full sm:w-auto">
                  <Button 
                    size="lg"
                    className="group w-full sm:w-auto bg-neutral-charcoal hover:bg-luxury-gold text-background rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 touch-manipulation"
                  >
                    <span className="flex items-center gap-2">
                      {t('imageTextSplit.learnStory')}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                
                <Link to="/technical" className="w-full sm:w-auto">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-neutral-charcoal text-neutral-charcoal hover:bg-neutral-charcoal hover:text-background rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold transition-all duration-300 touch-manipulation"
                  >
                    {t('imageTextSplit.technicalSpecs')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSplit;
