import { Crown, Palette, Shield, Truck, Award, HeartHandshake } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollReveal();

const features = [
  {
    icon: Crown,
      title: t('whyChooseUs.premiumQuality'),
      description: t('whyChooseUs.premiumQualityDesc'),
    color: "from-amber-400 to-amber-600",
  },
  {
    icon: Palette,
      title: t('whyChooseUs.exclusiveDesigns'),
      description: t('whyChooseUs.exclusiveDesignsDesc'),
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Shield,
      title: t('whyChooseUs.durabilityGuaranteed'),
      description: t('whyChooseUs.durabilityGuaranteedDesc'),
    color: "from-green-400 to-green-600",
  },
  {
    icon: Truck,
      title: t('whyChooseUs.globalDelivery'),
      description: t('whyChooseUs.globalDeliveryDesc'),
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Award,
      title: t('whyChooseUs.awardWinning'),
      description: t('whyChooseUs.awardWinningDesc'),
    color: "from-red-400 to-red-600",
  },
  {
    icon: HeartHandshake,
      title: t('whyChooseUs.expertSupport'),
      description: t('whyChooseUs.expertSupportDesc'),
    color: "from-teal-400 to-teal-600",
  },
];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
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
              {t('whyChooseUs.label')}
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-neutral-charcoal mb-6 tracking-tight">
            {t('whyChooseUs.title')}
          </h2>
          <p className="text-lg lg:text-xl text-neutral-slate leading-relaxed">
            {t('whyChooseUs.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-neutral-stone/20">
                {/* Icon Container */}
                <div className="mb-6 relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 transform group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-neutral-charcoal" />
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <h3 className="font-sans text-xl lg:text-2xl font-semibold text-neutral-charcoal mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base text-neutral-slate leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute top-0 right-0 w-2 h-8 bg-gradient-to-b ${feature.color} rounded-bl-lg`} />
                  <div className={`absolute top-0 right-0 w-8 h-2 bg-gradient-to-r ${feature.color} rounded-bl-lg`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16 lg:mt-20"
        >
          <p className="text-neutral-slate text-lg mb-6">
            {t('whyChooseUs.ctaText')}
          </p>
          <div className="inline-flex items-center gap-2 text-luxury-gold font-semibold group cursor-pointer">
            <span className="border-b-2 border-luxury-gold group-hover:border-luxury-bronze transition-colors">
              {t('whyChooseUs.learnMore')}
            </span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
