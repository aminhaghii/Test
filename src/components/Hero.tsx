import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const heroImages = [
  '/ALMAS/rico2.jpg',
  '/ALMAS/victoria.jpg',
  '/ALMAS/rico.jpg',
  '/ALMAS/PORPJA.jpg',
  '/ALMAS/ROJINA.jpg'
];

const Hero = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(heroImages.length).fill(false));

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide images every 5 seconds (skip errored images)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        let nextIndex = (prevIndex + 1) % heroImages.length;
        let attempts = 0;
        // Skip to next image if current one has error
        while (imageErrors[nextIndex] && attempts < heroImages.length) {
          nextIndex = (nextIndex + 1) % heroImages.length;
          attempts++;
        }
        return nextIndex;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [imageErrors]);

  const parallaxOffset = (prefersReducedMotion || isTouch) ? 0 : scrollY * 0.3; // Disable parallax on touch/reduced motion
  const currentImage = `${API_URL}${heroImages[currentImageIndex]}`;

  const handleImageError = (index: number) => {
    console.error('Error loading hero image:', `${API_URL}${heroImages[index]}`);
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <section 
      className="relative h-screen min-h-[700px] max-h-[920px] lg:max-h-[920px] overflow-hidden"
      style={{ transform: `translateY(${parallaxOffset}px)` }}
    >
      {/* Background Images with Auto-Slide */}
      <div className="absolute inset-0 bg-gray-900">
        <AnimatePresence mode="sync">
          {!imageErrors[currentImageIndex] && (
            <motion.img
              key={currentImageIndex}
              src={currentImage}
              alt="Premium Iranian ceramic tiles - Almas Kavir Rafsanjan"
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              loading="eager"
              fetchpriority="high"
              decoding="sync"
              sizes="(max-width: 768px) 100vw, 1920px"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              onLoad={() => {
                console.log('✅ Hero image loaded:', currentImage);
              }}
              onError={() => {
                console.error('❌ Error loading hero image:', currentImage);
                handleImageError(currentImageIndex);
              }}
            />
          )}
        </AnimatePresence>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-hero-dark" />
        
        {/* Image Indicators (Dots) */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'w-8 bg-luxury-gold' 
                  : 'w-2 bg-background/50 hover:bg-background/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-6 lg:px-20">
        <div className="max-w-5xl text-center animate-fade-in-up">
          {/* Eyebrow */}
          <div className="mb-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {t('heroSection.eyebrow')}
            </span>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mt-3 animate-scale-in" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* Headline */}
          <h1 
            className="font-display text-5xl lg:text-[88px] font-bold leading-tight lg:leading-[100px] text-background mb-14 tracking-tight"
            style={{ letterSpacing: "-0.015em", animationDelay: "0.4s" }}
          >
            {t('heroSection.title')}
          </h1>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-gentle"
        style={{ animationDelay: "1.5s" }}
      >
        <ChevronDown className="w-7 h-7 text-background/75" />
      </div>
    </section>
  );
};

export default Hero;
