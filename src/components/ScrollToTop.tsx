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
          className="fixed bottom-8 left-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-neutral-stone/50 bg-white/60 text-neutral-charcoal shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-neutral-charcoal/60 hover:bg-white/85"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

