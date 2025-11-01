import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Globe2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// API URL for backend resources
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BrandStory = () => {
  const { elementRef, isVisible } = useScrollReveal();

  const stats = [
    { icon: Sparkles, value: "60+", label: "Years of Excellence" },
    { icon: Users, value: "50K+", label: "Satisfied Clients" },
    { icon: Globe2, value: "85+", label: "Countries Worldwide" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-neutral-alabaster via-background to-neutral-linen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-bronze/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-20 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div
            ref={elementRef}
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="mb-6">
              <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                Our Heritage
              </span>
            </div>
            
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-neutral-charcoal mb-6 leading-tight tracking-tight">
              Crafting Timeless Beauty Since 1962
            </h2>
            
            <p className="text-lg text-neutral-slate leading-relaxed mb-6">
              For over six decades, we've been at the forefront of ceramic and porcelain innovation, 
              blending traditional Italian craftsmanship with cutting-edge technology.
            </p>
            
            <p className="text-base text-neutral-slate leading-relaxed mb-8">
              Each tile tells a story of passion, precision, and artistry. From our workshops in Italy 
              to prestigious projects worldwide, we transform spaces into timeless works of art.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/about">
                <Button 
                  size="lg" 
                  className="bg-luxury-gold hover:bg-luxury-bronze text-foreground rounded-full px-8 py-6 font-semibold group"
                >
                  Discover Our Story
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-neutral-charcoal text-neutral-charcoal hover:bg-neutral-charcoal hover:text-background rounded-full px-8 py-6 font-semibold"
                >
                  View Collections
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-stone">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  <stat.icon className="w-6 h-6 text-luxury-gold mb-2 mx-auto lg:mx-0" />
                  <div className="font-display text-3xl lg:text-4xl font-bold text-neutral-charcoal">
                    {stat.value}
                  </div>
                  <div className="font-technical text-xs uppercase tracking-wider text-neutral-slate mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image Grid */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {/* Large Image */}
              <div className="col-span-2 aspect-[16/10] rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={`${API_URL}/ALMAS/victoria.jpg`}
                  alt="Luxury ceramic tiles showcase"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Two Small Images */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={`${API_URL}/ALMAS/ROJINA.jpg`}
                  alt="Italian craftsmanship detail"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={`${API_URL}/ALMAS/PORPJA.jpg`}
                  alt="Modern tile installation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute top-8 right-8 bg-neutral-charcoal text-background px-6 py-4 rounded-2xl shadow-2xl"
            >
              <div className="text-sm font-technical uppercase tracking-wider text-luxury-gold mb-1">
                Est. 1962
              </div>
              <div className="text-2xl font-display font-bold">
                Italian Heritage
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
