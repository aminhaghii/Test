import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Award, CheckCircle2, Download, ZoomIn, Wrench, Globe, Palette, Shield, Cog, Headphones, Package, Lightbulb, Factory, TestTube, Medal, HandHeart, Heart, Users, TrendingUp, Building2, FileText, Leaf, ShieldCheck, Rocket, Globe2, ClipboardCheck, Phone, Box, Flame, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

// API URL for backend resources
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const About = () => {
  const { t } = useLanguage();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: storyRef, isVisible: storyVisible } = useScrollReveal();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certificates = [
    {
      id: 1,
      title: "ISO 14001:2015",
      subtitle: t('about.cert1Subtitle'),
      certNo: "005-23-14001-IR",
      image: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/20251020_200753.jpg`,
      description: t('about.cert1Description')
    },
    {
      id: 2,
      title: "ISO 45001:2018",
      subtitle: t('about.cert2Subtitle'),
      certNo: "004-23-45001-IR",
      image: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/20251020_200755.jpg`,
      description: t('about.cert2Description')
    },
    {
      id: 3,
      title: "ISO 9001:2015",
      subtitle: t('about.cert3Subtitle'),
      certNo: "260320-1",
      image: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/20251020_200758.jpg`,
      description: t('about.cert3Description')
    },
    {
      id: 4,
      title: t('about.cert4Title'),
      subtitle: "ISO 9001 / ISO 14001 / ISO 45001",
      certNo: "001-23-IMS-IR",
      image: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/20251020_200801.jpg`,
      description: t('about.cert4Description')
    }
  ];

  const pdfDocuments = [
    {
      title: t('about.pdf1Title'),
      filename: "Certificate_VCP12094_Tiles_ _Ceramics_Almas_Kavir_Rafsanjan_cor.pdf",
      path: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/Certificate_VCP12094_Tiles_ _Ceramics_Almas_Kavir_Rafsanjan_cor.pdf`
    },
    {
      title: t('about.pdf2Title'),
      filename: "پروانه 1.pdf",
      path: `${API_URL}/ALMAS/certificates/Almas kavir rafsanjan/پروانه 1.pdf`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Background Image (unchanged) */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${API_URL}/ALMAS/victoria.jpg`}
            alt="Almas Kavir Rafsanjan Factory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/40 via-luxury-bronze/30 to-blue-900/50"></div>
        </div>
        <div 
          ref={headerRef}
          className={`container mx-auto px-6 lg:px-20 text-center relative z-10 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white tracking-tight drop-shadow-2xl"
            >
              <span className="bg-gradient-to-r from-luxury-gold via-white to-luxury-gold bg-clip-text text-transparent">
                Almas Kavir Rafsanjan
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg"
            >
              {t('about.subtitle')}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 flex flex-wrap gap-6 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-luxury-gold hover:bg-luxury-bronze text-white rounded-full px-10 py-6 font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  {t('about.exploreProducts')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile In-Page TOC for About sections */}
      <nav className="lg:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-md border-y border-neutral-stone/30">
        <div className="container mx-auto px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-luxury-gold scrollbar-track-luxury-gold/30">
          <a href="#overview" className="inline-block mr-3 px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.overview')}</a>
          <a href="#story" className="inline-block mr-3 px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.story')}</a>
          <a href="#milestones" className="inline-block mr-3 px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.milestones')}</a>
          <a href="#capabilities" className="inline-block mr-3 px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.capabilities')}</a>
          <a href="#certifications" className="inline-block mr-3 px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.certifications')}</a>
          <a href="#downloads" className="inline-block px-3 py-1.5 rounded-full border border-neutral-stone/40 text-sm text-neutral-charcoal">{t('about.downloads')}</a>
        </div>
      </nav>

      {/* Overview Section (clean, no icons) */}
      <section id="overview" className="py-24 lg:py-32 bg-gradient-to-b from-neutral-alabaster to-background">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: t('about.overviewCard1Title'),
                description: t('about.overviewCard1Desc'),
              },
              {
                title: t('about.overviewCard2Title'),
                description: t('about.overviewCard2Desc'),
              },
              {
                title: t('about.overviewCard3Title'),
                description: t('about.overviewCard3Desc'),
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20"
              >
                <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-3">{card.title}</h3>
                <p className="text-neutral-slate leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Image + Text */}
      <section id="story" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-20">
          <div
            ref={storyRef}
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              storyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden mb-10">
              <img src={`${API_URL}/ALMAS/PORPJA.jpg`} alt="Factory" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/40 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="font-display text-xl font-semibold mb-1">{t('about.manufacturingFacility')}</h3>
                <p className="text-sm opacity-90">{t('about.manufacturingLocation')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-alabaster rounded-2xl p-8 border border-neutral-stone/30">
                <h4 className="font-display text-lg font-semibold text-neutral-charcoal mb-3">{t('about.storyCard1Title')}</h4>
                <p className="text-neutral-slate">{t('about.storyCard1Desc')}</p>
              </div>
              <div className="bg-neutral-alabaster rounded-2xl p-8 border border-neutral-stone/30">
                <h4 className="font-display text-lg font-semibold text-neutral-charcoal mb-3">{t('about.storyCard2Title')}</h4>
                <p className="text-neutral-slate">{t('about.storyCard2Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline (minimal) */}
      <section id="milestones" className="py-24 lg:py-32 bg-gradient-to-b from-background to-neutral-alabaster">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-4">{t('about.milestones')}</h2>
            <p className="text-neutral-slate text-lg">{t('about.milestonesDesc')}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-neutral-stone/40" />
              {[
                { year: "2010", title: t('about.milestone1Title'), description: t('about.milestone1Desc') },
                { year: "2012", title: t('about.milestone2Title'), description: t('about.milestone2Desc') },
                { year: "2015", title: t('about.milestone3Title'), description: t('about.milestone3Desc') },
                { year: "2018", title: t('about.milestone4Title'), description: t('about.milestone4Desc') },
                { year: "2020", title: t('about.milestone5Title'), description: t('about.milestone5Desc') },
                { year: "2024", title: t('about.milestone6Title'), description: t('about.milestone6Desc') },
              ].map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="relative pl-16 pb-10"
                >
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-xl bg-gradient-to-br from-luxury-gold to-luxury-bronze shadow-md ring-4 ring-luxury-gold/20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-neutral-stone/20 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-luxury-gold">{m.year}</span>
                      <div className="h-px bg-luxury-gold/30 flex-1" />
                    </div>
                    <h3 className="font-display text-xl text-neutral-charcoal mb-2">{m.title}</h3>
                    <p className="text-neutral-slate leading-relaxed">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-4">{t('about.capabilities')}</h2>
            <p className="text-neutral-slate text-lg">{t('about.capabilitiesDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: t('about.capability1'), description: t('about.capability1Desc') },
              { title: t('about.capability2'), description: t('about.capability2Desc') },
              { title: t('about.capability3'), description: t('about.capability3Desc') },
              { title: t('about.capability4'), description: t('about.capability4Desc') },
              { title: t('about.capability5'), description: t('about.capability5Desc') },
              { title: t('about.capability6'), description: t('about.capability6Desc') },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card rounded-2xl p-8 border border-neutral-stone/20 shadow-card"
              >
                <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-3">{c.title}</h3>
                <p className="text-neutral-slate leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications (minimal) */}
      <section id="certifications" className="py-24 lg:py-32 bg-gradient-to-b from-neutral-alabaster to-background">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-4">{t('about.certifications')}</h2>
            <p className="text-neutral-slate text-lg">{t('about.certificationsDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-card border border-neutral-stone/20"
              >
                <div className="relative aspect-[4/3] cursor-pointer overflow-hidden" onClick={() => setSelectedCert(cert.image)}>
                  <img src={cert.image} alt={`${cert.title} Certificate`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-neutral-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-background text-xs font-semibold">
                    {t('common.viewAll')}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-neutral-charcoal mb-1 group-hover:text-luxury-gold transition-colors">{cert.title}</h3>
                  <p className="text-xs text-neutral-slate mb-2">{cert.subtitle}</p>
                  <p className="text-xs text-luxury-gold font-mono bg-luxury-gold/10 px-2 py-1 rounded">{cert.certNo}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div id="downloads" className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-semibold text-neutral-charcoal text-center mb-8">{t('about.downloadDocuments')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {pdfDocuments.map((doc, index) => (
                <motion.a
                  key={index}
                  href={doc.path}
                  download={doc.filename}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group flex items-center gap-4 bg-card p-6 rounded-2xl shadow-card border border-neutral-stone/20 hover:border-luxury-gold/40"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-charcoal mb-1 group-hover:text-luxury-gold transition-colors">{doc.title}</h4>
                    <p className="text-sm text-neutral-slate">{t('about.pdfDocument')}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Dialog */}
      <Dialog open={selectedCert !== null} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-display text-2xl">{t('about.certificate')}</DialogTitle>
            <DialogDescription>{t('about.clickToClose')}</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4">
            {selectedCert && (
              <img src={selectedCert} alt="Certificate" className="w-full h-auto rounded-lg" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default About;