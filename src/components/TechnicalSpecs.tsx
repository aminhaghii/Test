import { Droplets, Thermometer, Footprints, Zap } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const TechnicalSpecs = () => {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollReveal();
  
  const specifications = [
    {
      icon: Droplets,
      title: t('technicalSpecs.waterAbsorption'),
      value: "< 0.5%",
      description: t('technicalSpecs.waterAbsorptionDesc'),
    },
    {
      icon: Thermometer,
      title: t('technicalSpecs.frostResistance'),
      value: t('technicalSpecs.certified'),
      description: t('technicalSpecs.frostResistanceDesc'),
    },
    {
      icon: Footprints,
      title: t('technicalSpecs.slipResistance'),
      value: "R10-R11",
      description: t('technicalSpecs.slipResistanceDesc'),
    },
    {
      icon: Zap,
      title: t('technicalSpecs.breakingStrength'),
      value: "> 1300N",
      description: t('technicalSpecs.breakingStrengthDesc'),
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-neutral-alabaster">
      <div className="container mx-auto px-6 lg:px-20">
        <div
          ref={elementRef}
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-16">
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {t('technicalSpecs.label')}
            </span>
            <h2 className="font-display text-5xl lg:text-6xl font-semibold text-neutral-charcoal mt-4 mb-6">
              {t('technicalSpecs.title')}
            </h2>
            <p className="text-lg text-neutral-slate max-w-3xl mx-auto">
              {t('technicalSpecs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specifications.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className={`bg-background p-8 rounded-xl border-2 border-neutral-charcoal/5 hover:border-luxury-gold/30 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-luxury-gold" />
                    </div>
                    <h3 className="font-sans text-base font-semibold text-neutral-charcoal mb-2">
                      {spec.title}
                    </h3>
                    <div className="text-3xl font-display font-bold text-luxury-gold mb-3">
                      {spec.value}
                    </div>
                    <p className="text-sm text-neutral-slate leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-slate text-sm mb-6">
              {t('technicalSpecs.standardsCompliance')}
            </p>
            <button className="px-10 py-4 bg-neutral-charcoal text-background rounded-full font-sans font-semibold hover:bg-luxury-gold hover:text-neutral-charcoal transition-all duration-500 hover:scale-105 shadow-elegant">
              {t('technicalSpecs.downloadDatasheet')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecs;
