import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ModernHero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disableMotion = isTouch || prefersReducedMotion;

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-charcoal">
      {/* Animated Background Gradient Mesh */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={disableMotion ? undefined : {
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={disableMotion ? undefined : {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(205,127,50,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={disableMotion ? undefined : {
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={disableMotion ? undefined : {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Content */}
      <motion.div 
        style={disableMotion ? undefined : { y, opacity }}
        className="relative z-10 container mx-auto px-6 lg:px-20 text-center"
      >
        {/* Floating Badge */}
        <motion.div
          initial={disableMotion ? undefined : { opacity: 0, y: 20 }}
          animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
          transition={disableMotion ? undefined : { duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/5 ${isTouch ? '' : 'backdrop-blur-xl'} border border-luxury-gold/20 mb-8`}
        >
          <span className="w-2 h-2 rounded-full bg-luxury-gold" />
          <span className="font-technical text-sm uppercase tracking-wider text-luxury-gold">
            {t('modernHero.badge')}
          </span>
        </motion.div>

        {/* Main Heading with Gradient */}
        <motion.h1
          initial={disableMotion ? undefined : { opacity: 0, y: 30 }}
          animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
          transition={disableMotion ? undefined : { duration: 0.8, delay: 0.2 }}
          className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-[0.9] tracking-tight"
        >
          <span className="block text-background">{t('modernHero.titleLine1')}</span>
          <span className="block bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent">
            {t('modernHero.titleLine2')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={disableMotion ? undefined : { opacity: 0, y: 20 }}
          animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
          transition={disableMotion ? undefined : { duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-neutral-linen max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {t('modernHero.subtitleLine1')}
          <br className="hidden md:block" />
          {t('modernHero.subtitleLine2')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={disableMotion ? undefined : { opacity: 0, y: 20 }}
          animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
          transition={disableMotion ? undefined : { duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/products">
            <Button 
              size="lg"
              className="group relative overflow-hidden bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal rounded-full px-10 py-7 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-luxury-gold/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('modernHero.exploreCollections')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-bronze to-luxury-brass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          
          <Link to="/about">
            <Button 
              size="lg"
              variant="outline"
              className={`border-2 border-background/30 text-background hover:bg-background/10 hover:border-background rounded-full px-10 py-7 text-lg font-semibold ${isTouch ? '' : 'backdrop-blur-sm'} transition-all duration-300`}
            >
              {t('modernHero.ourStory')}
            </Button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={disableMotion ? undefined : { opacity: 0 }}
          animate={disableMotion ? undefined : { opacity: 1 }}
          transition={disableMotion ? undefined : { duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={disableMotion ? undefined : { y: [0, 10, 0] }}
            transition={disableMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-neutral-linen text-sm font-technical uppercase tracking-wider">{t('modernHero.scroll')}</span>
            <div className="w-[2px] h-12 bg-gradient-to-b from-luxury-gold to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className={`absolute top-1/4 left-[10%] w-32 h-32 rounded-2xl bg-luxury-gold/5 ${isTouch ? '' : 'backdrop-blur-sm'} border border-luxury-gold/10`}
        animate={disableMotion ? undefined : {
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={disableMotion ? undefined : {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className={`absolute bottom-1/4 right-[15%] w-24 h-24 rounded-full bg-luxury-bronze/5 ${isTouch ? '' : 'backdrop-blur-sm'} border border-luxury-bronze/10`}
        animate={disableMotion ? undefined : {
          y: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={disableMotion ? undefined : {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};

export default ModernHero;
