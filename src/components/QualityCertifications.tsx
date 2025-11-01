import { Award, Shield, Leaf, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const certifications = [
  {
    icon: Award,
    title: "ISO 9001:2015",
    description: "International quality management certification",
  },
  {
    icon: Shield,
    title: "CE Certified",
    description: "European conformity standards compliance",
  },
  {
    icon: Leaf,
    title: "LEED Compatible",
    description: "Sustainable building material certified",
  },
  {
    icon: Sparkles,
    title: "Made in Italy",
    description: "Authentic Italian craftsmanship since 1962",
  },
];

const QualityCertifications = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-neutral-charcoal">
      <div className="container mx-auto px-6 lg:px-20">
        <div
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
            Excellence Guaranteed
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-background mt-4 mb-6">
            Quality & Certifications
          </h2>
          <p className="text-lg text-neutral-linen max-w-3xl mx-auto">
            Every tile carries the mark of Italian excellence with internationally recognized certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div
                key={index}
                className={`text-center p-8 bg-background/5 backdrop-blur-sm rounded-xl border border-background/10 hover:bg-background/10 hover:border-luxury-gold/30 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="font-sans text-xl font-semibold text-background mb-3">
                  {cert.title}
                </h3>
                <p className="text-neutral-linen text-sm leading-relaxed">
                  {cert.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QualityCertifications;
