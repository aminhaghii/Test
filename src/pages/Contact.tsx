import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// icons removed for a minimal, text-only contact page
import { toast } from "sonner";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    subject: "",
    message: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[k:string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[k:string]: string} = {};
    if (!formData.name.trim()) newErrors.name = t('common.required');
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = t('common.invalidEmail');
    if (!formData.subject) newErrors.subject = t('common.required');
    if (formData.message.trim().length < 10) newErrors.message = t('common.minChars');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(t('contact.fixFields'));
      return;
    }
    try {
      setSubmitting(true);
      await new Promise(r => setTimeout(r, 800));
      toast.success(t('contact.messageSent'));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: t('contact.phone'),
      details: ["+98 21-88218520"],
      action: "tel:+982188218520"
    },
    {
      title: t('contact.email'),
      details: ["info@almasceram.com", "support@almasceram.com"],
      action: "mailto:info@almasceram.com"
    },
    {
      title: t('contact.businessHours'),
      details: ["Sat - Wed: 9:00 AM - 6:00 PM", "Thursday: 9:00 AM - 1:00 PM"]
    },
    {
      title: t('contact.address'),
      details: ["10km Rafsanjan-Kerman Road", "Rafsanjan, Kerman Province, Iran"],
      action: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      {/* Hero with Background Image */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${API_URL}/ALMAS/PORPJA.jpg`}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/40 via-luxury-bronze/30 to-blue-900/50"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
            >
              {t('contact.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
            >
              {t('contact.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full hover:-translate-y-2">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 group-hover:text-gray-800 transition-colors">{detail}</p>
                    ))}
                  </div>
                  
                  {info.action && (
                    <div className="mt-4">
                      <a 
                        href={info.action}
                        className="text-gray-900 underline underline-offset-4 hover:text-gray-600 font-medium text-sm transition-colors"
                      >
                        {info.title === t('contact.phone') && t('contact.callNow')}
                        {info.title === t('contact.email') && t('contact.emailUs')}
                        {info.title === t('contact.address') && t('contact.getDirections')}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">{t('contact.sendMessageTitle')}</span>
                  </h2>
                  <p className="text-gray-600">{t('contact.sendMessageDesc')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-semibold mb-2 block">
                        {t('contact.name')} *
                      </Label>
                      <Input 
                        id="name"
                        type="text"
                        placeholder={t('contact.fullNamePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`h-12 ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-luxury-gold focus:ring-luxury-gold'}`}
                      />
                      {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-semibold mb-2 block">
                        {t('contact.email')} *
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder={t('contact.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`h-12 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-luxury-gold focus:ring-luxury-gold'}`}
                      />
                      {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-semibold mb-2 block">
                      {t('contact.phone')}
                    </Label>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder={t('contact.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12 border-gray-300 focus:border-luxury-gold focus:ring-luxury-gold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-semibold mb-2 block">
                      {t('contact.subject')} *
                    </Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      className={`w-full h-12 px-3 border rounded-md focus:outline-none ${errors.subject ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-luxury-gold focus:ring-luxury-gold'}`}
                    >
                      <option value="">{t('contact.selectSubject')}</option>
                      <option value="sales">{t('contact.salesInquiry')}</option>
                      <option value="support">{t('contact.technicalSupport')}</option>
                      <option value="export">{t('contact.exportServices')}</option>
                      <option value="visit">{t('contact.factoryVisit')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                    {errors.subject && <p id="subject-error" className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-semibold mb-2 block">
                      {t('contact.message')} *
                    </Label>
                    <Textarea 
                      id="message"
                      placeholder={t('contact.messagePlaceholder')}
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`resize-none ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-luxury-gold focus:ring-luxury-gold'}`}
                    />
                    {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full h-14 text-lg font-semibold ${submitting ? 'bg-neutral-500' : 'bg-neutral-900 hover:bg-neutral-800'} text-white transition-all duration-300`}
                  >
                    {submitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Showroom Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-bronze/10 rounded-3xl p-8 border-2 border-luxury-gold/20 h-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('contact.visitFactory')}
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="hidden" />
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">Almas Kavir Rafsanjan</h4>
                        <p className="text-gray-700 leading-relaxed mb-3">
                          10 Kilometers Rafsanjan-Kerman Road<br />
                          Rafsanjan, Kerman Province<br />
                          Iran
                        </p>
                        <a 
                          href="https://maps.google.com/?q=30.4067,55.9939"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-12 px-5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                        >
                          {t('contact.getDirections')}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps */}
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-4">
                      {t('contact.ourLocation')}
                    </h4>
                    <div className="rounded-xl overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.1234567890123!2d55.9939!3d30.4067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAlmas%20Kavir%20Rafsanjan!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Almas Kavir Rafsanjan Location"
                      ></iframe>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-4">
                      {t('contact.whyVisitUs')}
                    </h4>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">
                      <li>{t('contact.visitReason1')}</li>
                      <li>{t('contact.visitReason2')}</li>
                      <li>{t('contact.visitReason3')}</li>
                      <li>{t('contact.visitReason4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Floating Button removed by request */}
    </div>
  );
};

export default Contact;