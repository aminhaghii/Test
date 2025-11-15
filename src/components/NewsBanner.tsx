import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type Slide = {
  id: string;
  image: string;
  objectPosition?: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaLink: string;
};

const NewsBanner = () => {
  const { t } = useLanguage();
  
  const slides: Slide[] = useMemo(
    () => [
      {
        id: "legacy",
        image: "/Content/photo_24_2025-11-08_11-15-22.jpg",
        objectPosition: "center 30%",
        heading:
          t("common.excellenceBanner") ||
          "14+ Years of Excellence in Iranian Ceramic Manufacturing",
        description:
          t("newsBanner.slides.legacy.description") ||
          "From bespoke slabs to hospitality-scale fit-outs, our production teams deliver disciplined quality with a signature Pietra Luxe finish.",
        ctaLabel: t("common.readMore") || "Read more",
        ctaLink: "/about",
      },
      {
        id: "people",
        image: "/Content/photo_11_2025-11-08_11-15-22.jpg",
        objectPosition: "center 42%",
        heading: t("newsBanner.slides.people.heading") || "Crafted by People, Powered by Expertise",
        description:
          t("newsBanner.slides.people.description") ||
          "Our engineers, designers, and field specialists partner with clients to translate architectural visions into ready-to-install surface solutions.",
        ctaLabel: t("newsBanner.slides.people.ctaLabel") || "Meet the team",
        ctaLink: "/about#team",
      },
    ],
    [t]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const slideCount = slides.length;
  const activeSlide = slides[activeIndex];

  // Variants برای انیمیشن اسلاید
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Variants برای محتوای داخلی
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // تابع تغییر اسلاید
  const goToSlide = (newDirection: "next" | "prev") => {
    setDirection(newDirection === "next" ? 1 : -1);
    setActiveIndex((prevIndex) => {
      if (newDirection === "next") {
        return (prevIndex + 1) % slideCount;
      }
      return (prevIndex - 1 + slideCount) % slideCount;
    });
  };

  // رفتن به اسلاید مشخص (برای indicators)
  const goToSpecificSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Auto-play (اختیاری - کامنت کنید اگر نمی‌خواهید)
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide("next");
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-0 lg:px-0 max-w-[1800px]">
        <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[520px] overflow-hidden rounded-none bg-neutral-900">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", ease: "easeInOut", duration: 0.6 },
                opacity: { duration: 0.4 },
              }}
              className="absolute inset-0"
            >
              {/* تصویر پس‌زمینه */}
              <div className="absolute inset-0">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.heading}
                  className="w-full h-full object-cover"
                  style={{ 
                    objectPosition: activeSlide.objectPosition || "center" 
                  }}
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

              {/* محتوا */}
              <motion.div
                className="relative h-full flex items-center justify-center px-4 sm:px-5 md:px-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
                  <motion.h3
                    variants={itemVariants}
                    className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white leading-[1.2]"
                  >
                    {activeSlide.heading}
                  </motion.h3>

                  <motion.p
                    variants={itemVariants}
                    className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-3xl mx-auto px-2"
                  >
                    {activeSlide.description}
                  </motion.p>

                  <motion.div variants={itemVariants} className="flex justify-center pt-1 sm:pt-1.5 md:pt-2">
                    <Link to={activeSlide.ctaLink} className="text-white font-semibold uppercase tracking-[0.2em] hover:underline transition-all duration-300 text-xs sm:text-sm md:text-base touch-manipulation">
                      {activeSlide.ctaLabel}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* دکمه‌های ناوبری */}
          <div className="absolute inset-y-0 left-1 sm:left-2 md:left-4 right-1 sm:right-2 md:right-4 flex items-center justify-between pointer-events-none z-10">
            <button
              type="button"
              onClick={() => goToSlide("prev")}
              className="pointer-events-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-charcoal focus:ring-offset-2 touch-manipulation"
              aria-label={t('newsBanner.previousSlide')}
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-neutral-charcoal" />
            </button>

            <button
              type="button"
              onClick={() => goToSlide("next")}
              className="pointer-events-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-charcoal focus:ring-offset-2 touch-manipulation"
              aria-label={t('newsBanner.nextSlide')}
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-neutral-charcoal" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSpecificSlide(index)}
                className={`h-2 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${
                  index === activeIndex
                    ? "w-8 bg-neutral-charcoal shadow-lg"
                    : "w-2 bg-white/50 hover:bg-white/80 hover:w-4"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsBanner;