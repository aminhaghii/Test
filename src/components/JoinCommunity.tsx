import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const JoinCommunity = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-[1800px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, margin: "-50px" }} className="rounded-xl sm:rounded-2xl border border-neutral-stone/30 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-12 bg-card text-center max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight text-neutral-charcoal font-bold mb-2 sm:mb-2.5 md:mb-3">{t('community.title')}</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-slate mb-5 sm:mb-6 md:mb-7 lg:mb-8 px-2">{t('community.subtitle') || 'Subscribe to receive updates about products, projects and news.'}</p>
          {submitted ? (
            <div className="text-sm sm:text-base md:text-lg text-neutral-charcoal font-semibold">{t('community.thanks') || 'Thanks for subscribing!'}</div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="mx-auto max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('community.email') || 'Enter your email'}
                className="flex-1 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-sm sm:text-base border border-neutral-stone/40 bg-background outline-none focus:ring-2 focus:ring-neutral-charcoal/50 transition-all duration-300 hover:border-neutral-stone/60 focus:border-neutral-charcoal/50 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              <button 
                type="submit" 
                className="text-neutral-charcoal font-semibold px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-sm sm:text-base rounded-full border border-neutral-charcoal/20 hover:border-neutral-charcoal/40 hover:bg-neutral-charcoal/5 transition-all duration-300 touch-manipulation"
              >
                {t('community.subscribe') || 'Subscribe'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default JoinCommunity;


