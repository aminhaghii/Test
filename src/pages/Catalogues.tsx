import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Catalogues = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('catalogues.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('catalogues.description')}
          </p>
        </div>
      </section>

      {/* Content Placeholder */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">
              {t('catalogues.comingSoon')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalogues;