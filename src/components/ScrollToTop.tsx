import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={prefersReducedMotion || isTouch ? undefined : { opacity: 0, scale: 0 }}
          animate={prefersReducedMotion || isTouch ? undefined : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion || isTouch ? undefined : { opacity: 0, scale: 0 }}
          whileHover={prefersReducedMotion || isTouch ? undefined : { scale: 1.1 }}
          whileTap={prefersReducedMotion || isTouch ? undefined : { scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 p-4 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-bronze text-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

