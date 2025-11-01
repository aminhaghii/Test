import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ModernTestimonials = () => {
  const { t } = useLanguage();
  const testimonials = [
    {
      name: "Ahmad Rezaei",
      role: t('testimonials.role1'),
      company: "Tehran Construction Group",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      text: t('testimonials.text1'),
      rating: 5
    },
    {
      name: "Fatemeh Karimi",
      role: t('testimonials.role2'),
      company: "Karimi Design Studio",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatemeh",
      text: t('testimonials.text2'),
      rating: 5
    },
    {
      name: "Mohammad Hassanpour",
      role: t('testimonials.role3'),
      company: "Persian Ceramics Trading",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad",
      text: t('testimonials.text3'),
      rating: 5
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-luxury-bronze/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-20 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 mb-6">
            <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
            <span className="font-technical text-xs uppercase tracking-wider text-luxury-gold font-semibold">
              {t('testimonials.label')}
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-charcoal mb-6 tracking-tight">
            {t('testimonials.trustedBy')}
            <br />
            <span className="bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent">
              {t('testimonials.industryLeaders')}
            </span>
          </h2>
          <p className="text-xl text-neutral-slate max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card */}
              <div className="h-full bg-card rounded-3xl p-8 border border-neutral-stone/20 hover:border-luxury-gold/30 transition-all duration-500 hover:-translate-y-2 shadow-card hover:shadow-card-hover">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-luxury-gold fill-luxury-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-neutral-charcoal text-lg leading-relaxed mb-8 relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-luxury-gold/20 font-serif">"</span>
                  <span className="relative z-10">{testimonial.text}</span>
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-neutral-stone/20">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-luxury-gold/10 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-neutral-charcoal mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-neutral-slate">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-luxury-gold font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-luxury-gold/10 to-luxury-bronze/10 rounded-3xl -z-10 group-hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-12 px-10 py-6 rounded-2xl bg-neutral-alabaster border border-neutral-stone/20">
            <div>
              <div className="font-display text-4xl font-bold text-luxury-gold mb-1">14+</div>
              <div className="text-sm text-neutral-slate">{t('stats.yearsExperience')}</div>
            </div>
            <div className="w-px h-12 bg-neutral-stone/20" />
            <div>
              <div className="font-display text-4xl font-bold text-luxury-gold mb-1">13</div>
              <div className="text-sm text-neutral-slate">{t('testimonials.exportCountries')}</div>
            </div>
            <div className="w-px h-12 bg-neutral-stone/20" />
            <div>
              <div className="font-display text-4xl font-bold text-luxury-gold mb-1">350+</div>
              <div className="text-sm text-neutral-slate">{t('testimonials.productModels')}</div>
            </div>
            <div className="w-px h-12 bg-neutral-stone/20" />
            <div>
              <div className="font-display text-4xl font-bold text-luxury-gold mb-1">ISO</div>
              <div className="text-sm text-neutral-slate">{t('quality.iso')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernTestimonials;
