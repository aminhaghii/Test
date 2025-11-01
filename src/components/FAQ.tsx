import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();

  const faqItems = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6')
    },
    {
      question: t('faq.q7'),
      answer: t('faq.a7')
    },
    {
      question: t('faq.q8'),
      answer: t('faq.a8')
    },
    {
      question: t('faq.q9'),
      answer: t('faq.a9')
    },
    {
      question: t('faq.q10'),
      answer: t('faq.a10')
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-neutral-alabaster relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-luxury-bronze/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-20 relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 mb-6">
            <HelpCircle className="w-4 h-4 text-luxury-gold" />
            <span className="font-technical text-xs uppercase tracking-wider text-luxury-gold font-semibold">
              {t('faq.label')}
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-charcoal mb-6 tracking-tight">
            {t('faq.title')}
            <br />
            <span className="bg-gradient-to-r from-luxury-gold via-luxury-bronze to-luxury-brass bg-clip-text text-transparent">
              {t('faq.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed">
            {t('faq.description')}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-2xl border border-neutral-stone/20 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-neutral-charcoal hover:text-luxury-gold transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-neutral-slate leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-bronze/10 rounded-3xl p-8 lg:p-12 border border-luxury-gold/20">
            <h3 className="font-display text-2xl lg:text-3xl font-semibold text-neutral-charcoal mb-4">
              {t('faq.ctaTitle')}
            </h3>
            <p className="text-lg text-neutral-slate mb-6 max-w-2xl mx-auto">
              {t('faq.ctaDescription')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="mailto:info@almasceram.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-luxury-gold hover:bg-luxury-bronze text-white rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t('faq.contactUs')}
              </a>
              <a 
                href="tel:+982188218520"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-full font-semibold transition-all duration-300"
              >
                {t('faq.callNow')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
