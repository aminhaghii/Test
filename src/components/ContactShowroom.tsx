import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import showroomImage from "@/assets/showroom-main.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactShowroom = () => {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="py-24 lg:py-32 bg-warm-linen">
      <div className="container mx-auto px-6 lg:px-20">
        <div
          ref={elementRef}
          className={`grid lg:grid-cols-2 gap-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Contact Form */}
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-6">
              {t('contactShowroom.title')}
            </h2>
            <p className="text-lg text-neutral-slate mb-10">
              {t('contactShowroom.description')}
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input placeholder={t('contactShowroom.fullName')} className="h-14 bg-background border-2" />
                <Input placeholder={t('contactShowroom.emailAddress')} type="email" className="h-14 bg-background border-2" />
              </div>
              <Input placeholder={t('contactShowroom.phoneNumber')} className="h-14 bg-background border-2" />
              <Textarea placeholder={t('contactShowroom.projectDetails')} className="min-h-40 bg-background border-2" />
              <Button className="w-full bg-neutral-charcoal text-background hover:bg-luxury-gold px-12 py-6 h-auto rounded-full font-semibold uppercase tracking-wider transition-elegant">
                {t('contactShowroom.sendMessage')}
              </Button>
            </form>
          </div>

          {/* Showroom Card */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-card">
            <img src={showroomImage} alt="Our Luxury Showroom" className="w-full h-64 object-cover" />
            <div className="p-10">
              <p className="font-technical text-xs uppercase tracking-widest text-luxury-gold mb-3">{t('contactShowroom.visitShowroom')}</p>
              <h3 className="font-display text-3xl font-semibold text-neutral-charcoal mb-4">Milan Design District</h3>
              <div className="space-y-3 text-neutral-graphite mb-6">
                <p>Via Tortona 31, 20144 Milano, Italy</p>
                <p>+39 02 123 4567</p>
                <p>showroom@ceramicaitalia.com</p>
                <div className="bg-alabaster p-4 rounded-lg mt-6">
                  <p className="text-sm font-medium">Mon-Fri: 9:00 - 18:00</p>
                  <p className="text-sm font-medium">Sat: 10:00 - 16:00</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-foreground rounded-full">
                {t('contactShowroom.bookAppointment')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactShowroom;
