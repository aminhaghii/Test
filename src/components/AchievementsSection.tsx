import { Award, Building2, Globe, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const achievements = [
  {
    icon: Building2,
    number: 15000,
    suffix: "+",
    label: "Projects Completed",
    description: "Worldwide installations",
  },
  {
    icon: Award,
    number: 42,
    suffix: "+",
    label: "Design Awards",
    description: "International recognition",
  },
  {
    icon: Globe,
    number: 85,
    suffix: "+",
    label: "Countries Served",
    description: "Global presence",
  },
  {
    icon: TrendingUp,
    number: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Excellence guaranteed",
  },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-display text-5xl lg:text-6xl font-bold text-neutral-charcoal">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const AchievementsSection = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-neutral-alabaster relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-bronze rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative">
        {/* Section Header */}
        <div
          ref={elementRef}
          className={`text-center mb-16 lg:mb-20 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="mb-4">
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              Our Legacy
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-neutral-charcoal mb-6 tracking-tight">
            Numbers That Speak Excellence
          </h2>
          <p className="text-lg lg:text-xl text-neutral-slate leading-relaxed">
            Six decades of dedication to perfection, innovation, and customer satisfaction
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-card rounded-2xl p-8 lg:p-10 text-center shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-neutral-stone/10 relative overflow-hidden">
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-luxury-bronze/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-bronze p-0.5 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <achievement.icon className="w-8 h-8 text-luxury-gold" />
                    </div>
                  </div>
                  {/* Icon Glow */}
                  <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-luxury-gold/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Number */}
                <div className="mb-3 relative">
                  {isVisible && (
                    <AnimatedCounter target={achievement.number} suffix={achievement.suffix} />
                  )}
                </div>

                {/* Label */}
                <h3 className="font-sans text-lg lg:text-xl font-semibold text-neutral-charcoal mb-2 relative">
                  {achievement.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-slate relative">
                  {achievement.description}
                </p>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-luxury-gold to-luxury-bronze group-hover:w-3/4 transition-all duration-500 rounded-t-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <div className="relative inline-block">
            <svg className="absolute -top-4 -left-6 w-10 h-10 text-luxury-gold/20" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
            </svg>
            <p className="font-display text-2xl lg:text-3xl text-neutral-charcoal leading-relaxed italic px-8">
              Perfection is not attainable, but if we chase perfection we can catch excellence.
            </p>
            <svg className="absolute -bottom-4 -right-6 w-10 h-10 text-luxury-gold/20 rotate-180" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
            </svg>
          </div>
          <p className="mt-6 text-neutral-slate font-medium">
            — Our Commitment Since 1962
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
