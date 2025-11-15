import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { getApiUrl } from '@/lib/getApiUrl';

const API_URL = getApiUrl();

const ExportPage = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Core Services Data
  const coreServices = [
    {
      title: "End-to-End Consulting",
      description: "From product selection to on-site installation guidance—professional partnership for long-term success and the global promotion of Iranian architectural heritage.",
      image: `${API_URL}/DECORED/60 x 60/gloria.jpg`
    },
    {
      title: "Global Logistics & Documentation",
      description: "Professional international transport logistics, complete handling of all legal documentation and global agreements, and customs paperwork.",
      image: `${API_URL}/DECORED/60X120/FRANCO 1.jpg`
    },
    {
      title: "Post-Delivery Support",
      description: "Committed after-sales assistance with technical guidance, maintenance, and performance assurance.",
      image: `${API_URL}/DECORED/40 x 40/berlin.jpg`
    }
  ];

  // Competitive Advantages
  const advantages = [
    {
      title: "Competitive Pricing",
      description: "Always backed by a quality guarantee and versatile payment options tailored to your needs."
    },
    {
      title: "Quality Guarantee",
      description: "Uncompromising quality standards ensuring your satisfaction and project success."
    },
    {
      title: "Ongoing Technical Support",
      description: "Continuous assistance after delivery with expert guidance and support."
    },
    {
      title: "No Restrictions",
      description: "Every client, from boutique projects to national distributors, benefits from our efficient process."
    }
  ];

  // Process Timeline Steps
  const processSteps = [
    {
      title: "Initial Inquiry",
      description: "Contact our export team to discuss your requirements and project scope."
    },
    {
      title: "Consultation & Planning",
      description: "Our experts guide you through product selection and customization options."
    },
    {
      title: "Customization & Production",
      description: "We adapt production for your unique project needs, especially for orders exceeding 100,000 m²."
    },
    {
      title: "Documentation & Logistics",
      description: "Complete handling of legal documentation, agreements, and international transport."
    },
    {
      title: "Delivery & Support",
      description: "Professional delivery with ongoing technical support and performance assurance."
    }
  ];

  // Information Cards
  const infoCards = [
    {
      title: "Export Consultancy Request",
      description: "Engage our experts from planning to project completion. Fill out our export consultancy request form to get started with professional guidance tailored to your needs."
    },
    {
      title: "Partnership Terms & Pricing",
      description: "Request detailed partnership terms, pricing tables, or schedule a factory tour. We offer flexible terms and competitive pricing for all project sizes."
    },
    {
      title: "Factory Tour & Live Chat",
      description: "Plan an on-site visit for your team or chat live with our export team to discuss technical details, logistics, or custom requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 sm:py-28 md:py-32 lg:py-40 bg-gradient-to-b from-neutral-alabaster to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Decorative Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-12"
            />

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-neutral-charcoal mb-10 leading-[1.1] tracking-tight">
              Export Services:
              <br />
              <span className="text-luxury-gold italic font-light">Seamless Pathways</span>
              <br />
              to Global Markets
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-neutral-slate leading-relaxed max-w-3xl mx-auto mb-16 font-light"
            >
              For us, exporting is more than just shipping tiles—it's a professional partnership for long-term success and the global promotion of Iranian architectural heritage.
            </motion.p>

            {/* Stats - Classic Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-12 text-sm sm:text-base text-neutral-slate border-t border-b border-neutral-stone/20 py-8"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display text-luxury-gold mb-2 font-light">13+</div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-slate/70">Countries</div>
              </div>
              <div className="w-px h-12 bg-neutral-stone/20"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display text-luxury-gold mb-2 font-light">14+</div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-slate/70">Years Experience</div>
              </div>
              <div className="w-px h-12 bg-neutral-stone/20"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display text-luxury-gold mb-2 font-light">100%</div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-slate/70">Quality Guaranteed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 sm:mb-24"
          >
            <div className="w-20 h-px bg-luxury-gold mx-auto mb-8"></div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-charcoal mb-8 leading-tight tracking-tight">
              Comprehensive Export Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed font-light">
              Our export services cover comprehensive consulting from product selection to installation guidance on-site; professional international transport logistics; complete handling of all legal documentation and global agreements; and end-to-end post-delivery support.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-20 sm:space-y-24 max-w-6xl mx-auto"
          >
            {coreServices.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-neutral-alabaster">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/10 to-transparent"></div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div className="w-12 h-px bg-luxury-gold mb-6"></div>
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-charcoal leading-tight tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-base sm:text-lg text-neutral-slate leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Customization & Flexibility Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-b from-background to-neutral-alabaster">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 sm:mb-24"
          >
            <div className="w-20 h-px bg-luxury-gold mx-auto mb-8"></div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-charcoal mb-8 leading-tight tracking-tight">
              Unmatched Flexibility & Customization
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-slate max-w-4xl mx-auto leading-relaxed font-light">
              We offer unmatched flexibility in the customization of dimensions, designs, colors, and packaging tailored to specific market needs—particularly for large-volume orders exceeding 100,000 m², where we adapt production for truly unique projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-18 max-w-6xl mx-auto">
            {/* Customization Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-neutral-alabaster">
                <img
                  src={`${API_URL}/DECORED/60 x 60/parma.jpg`}
                  alt="Customization capabilities"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="w-12 h-px bg-luxury-gold mb-6"></div>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-neutral-charcoal mb-6 leading-tight tracking-tight">
                  Tailored Solutions
                </h3>
                <p className="text-base text-neutral-slate leading-relaxed font-light mb-8">
                  Flexible customization of dimensions, designs, colors, and packaging tailored to specific market needs. We adapt production for truly unique projects, especially for large-volume orders exceeding 100,000 m².
                </p>
                <div className="space-y-4">
                  {[
                    "Custom Dimensions",
                    "Design Variations",
                    "Color Options",
                    "Packaging Solutions"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2.5 flex-shrink-0"></div>
                      <span className="text-sm text-neutral-slate font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Large Orders Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-neutral-alabaster">
                <img
                  src={`${API_URL}/DECORED/60X120/RAKU.jpg`}
                  alt="Large-volume orders"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="w-12 h-px bg-luxury-gold mb-6"></div>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-neutral-charcoal mb-6 leading-tight tracking-tight">
                  Production Excellence
                </h3>
                <p className="text-base text-neutral-slate leading-relaxed font-light mb-8">
                  Special focus on orders exceeding 100,000 m². We adapt our production processes to meet your unique project requirements, ensuring consistent quality and timely delivery.
                </p>
                <div className="space-y-4">
                  {[
                    "Production line adaptation",
                    "Dedicated quality control",
                    "Customized packaging",
                    "Flexible delivery schedules"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2.5 flex-shrink-0"></div>
                      <span className="text-sm text-neutral-slate font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 sm:mb-24"
          >
            <div className="w-20 h-px bg-luxury-gold mx-auto mb-8"></div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-charcoal mb-8 leading-tight tracking-tight">
              Why Choose Our Export Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed font-light">
              Competitive pricing is always backed by a quality guarantee, versatile payment options, and ongoing technical support after delivery.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-14 max-w-7xl mx-auto"
          >
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                variants={fadeInUp}
                className="text-left space-y-6 pb-10 border-b border-neutral-stone/15"
              >
                <div className="w-12 h-px bg-luxury-gold"></div>
                <h3 className="font-display text-xl sm:text-2xl font-normal text-neutral-charcoal leading-tight tracking-tight">
                  {advantage.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-slate leading-relaxed font-light">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-b from-background to-neutral-alabaster">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 sm:mb-24"
          >
            <div className="w-20 h-px bg-luxury-gold mx-auto mb-8"></div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-charcoal mb-8 leading-tight tracking-tight">
              Our Export Process
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed font-light">
              From initial inquiry to delivery, we ensure an efficient, transparent, and agile export process.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-16 sm:space-y-20"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="flex gap-10 sm:gap-12"
                >
                  {/* Decorative Line */}
                  <div className="flex-shrink-0 pt-2">
                    <div className="w-px h-full bg-luxury-gold/30"></div>
                    <div className="w-3 h-3 rounded-full bg-luxury-gold -ml-1 mt-4"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="w-12 h-px bg-luxury-gold"></div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-normal text-neutral-charcoal leading-tight tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-neutral-slate leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Information Cards Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 sm:mb-24"
          >
            <div className="w-20 h-px bg-luxury-gold mx-auto mb-8"></div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-charcoal mb-8 leading-tight tracking-tight">
              Get Started with Export Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed font-light">
              There are no restrictions—every client, from boutique projects to national distributors, can benefit from our efficient, transparent, and agile export process.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-14 max-w-7xl mx-auto"
          >
            {infoCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                className="space-y-6 pb-10 border-b border-neutral-stone/15"
              >
                <div className="w-12 h-px bg-luxury-gold"></div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-normal text-neutral-charcoal leading-tight tracking-tight">
                  {card.title}
                </h3>
                <p className="text-base text-neutral-slate leading-relaxed font-light">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExportPage;
