import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

const heroImagePath = '/ALMAS/rico2.jpg';
const heroVideoSrc = new URL("../../Content/almas 01.mp4", import.meta.url).href;

type LiquidGlassProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

const LiquidGlass = ({ children, className, innerClassName }: LiquidGlassProps) => (
  <div className={cn("relative overflow-hidden rounded-[32px]", className)}>
    <div className="absolute inset-0 bg-white/16 backdrop-blur-[24px] border border-white/35 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" />
    <div className="absolute inset-0 border border-white/60 rounded-[32px] pointer-events-none" />
    <div className={cn("relative", innerClassName)}>{children}</div>
  </div>
);

const Hero = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoOpen) {
      video.currentTime = 0;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay might be blocked; controls remain available.
      });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsVideoReady(false);
    }
  }, [isVideoOpen]);

  const parallaxOffset = (prefersReducedMotion || isTouch) ? 0 : scrollY * 0.3; // Disable parallax on touch/reduced motion
  const currentImage = `${API_URL}${heroImagePath}`;

  return (
    <section 
      className="relative h-[100vh] min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] overflow-hidden"
      style={{ transform: `translateY(${parallaxOffset * 0.9}px)` }}
    >
      <div className="absolute inset-0">
        {!isVideoOpen && (
          <img
              src={currentImage}
              alt={t('heroSection.imageAlt')}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              loading="eager"
              fetchpriority="high"
              decoding="sync"
              sizes="(max-width: 768px) 100vw, 1920px"
          />
        )}
        {isVideoOpen && (
          <AnimatePresence>
            <motion.div
              key="hero-video"
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls
                muted
                preload="metadata"
                poster={currentImage}
                onLoadedData={() => setIsVideoReady(true)}
              >
                <source src={heroVideoSrc} type="video/mp4" />
                {t('heroSection.videoNotSupported') ?? 'Your browser does not support the video tag.'}
              </video>
              {!isVideoReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white uppercase tracking-[0.4em] text-xs">
                  {t('heroSection.loading') ?? 'Loading'}
                </div>
          )}
            </motion.div>
        </AnimatePresence>
        )}
        {!isVideoOpen && (
          <div className="absolute inset-y-0 left-0 flex items-center">
            <div className="ml-4 sm:ml-6 md:ml-12 lg:ml-20 max-w-lg px-2 sm:px-0">
              <LiquidGlass
                className="shadow-[0_24px_70px_-25px_rgba(0,0,0,0.65)] border border-white/30 transition-all duration-500 hover:shadow-[0_28px_80px_-20px_rgba(0,0,0,0.7)]"
                innerClassName="px-6 py-7 sm:px-10 sm:py-9 md:px-12 md:py-10 text-center space-y-4 sm:space-y-6"
              >
                <h1 className="text-white text-xl sm:text-2xl md:text-[32px] lg:text-[36px] font-display uppercase tracking-[0.18em] leading-[1.45]">
                  {t('heroSection.craftedForLiving')}
                </h1>
                <p className="text-white/90 text-[10px] sm:text-xs tracking-[0.32em] uppercase">
                  {t('heroSection.signatureSurfaces')}
                </p>
                <div className="flex justify-center">
                  <LiquidGlass className="inline-flex rounded-[24px] border border-white/60 transition-all duration-300 hover:border-white/80 hover:shadow-lg" innerClassName="px-5 py-2 sm:px-7 sm:py-2.5">
            <button
                      type="button"
                      className="text-white uppercase tracking-[0.28em] text-[10px] sm:text-[11px] transition-opacity hover:opacity-90"
                    >
                      {t('common.discoverMore')}
                    </button>
                  </LiquidGlass>
        </div>
              </LiquidGlass>
      </div>
          </div>
        )}
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="group absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center touch-manipulation"
        onClick={(event) => {
          event.stopPropagation();
          if (isVideoOpen) {
            setIsVideoOpen(false);
          }
        }}
        aria-label={t('heroSection.previous') ?? 'Previous'}
      >
        <span className="px-2.5 py-2.5 sm:px-3 sm:py-3 rounded-md bg-black/35 text-white transition group-hover:bg-black/50">
          <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </span>
      </button>
      <button
        type="button"
        className="group absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center touch-manipulation"
        onClick={(event) => {
          event.stopPropagation();
          if (!isVideoOpen) {
            setIsVideoOpen(true);
          }
        }}
        aria-label={t('heroSection.next') ?? 'Next'}
      >
        <span className="px-2.5 py-2.5 sm:px-3 sm:py-3 rounded-md bg-black/35 text-white transition group-hover:bg-black/50">
          <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </span>
      </button>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 animate-bounce-gentle"
        style={{ animationDelay: "1.5s" }}
      >
        <ChevronDown className="w-5 h-5 sm:w-7 sm:h-7 text-background/75" />
      </div>

    </section>
  );
};

export default Hero;
