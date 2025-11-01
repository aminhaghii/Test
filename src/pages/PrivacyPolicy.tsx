import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Globe, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, company information, and project details."
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products and services."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. Contact us if you wish to exercise any of these rights."
    },
    {
      icon: Globe,
      title: "International Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws."
    },
    {
      icon: Shield,
      title: "Cookies and Tracking",
      content: "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-alabaster via-neutral-linen to-neutral-parchment">
      {/* Header */}
      <div className="bg-gradient-to-r from-luxury-gold to-luxury-bronze py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-charcoal mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-sm text-neutral-charcoal/60 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-luxury-gold to-luxury-bronze p-3 rounded-xl">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-charcoal mb-4">
                    {section.title}
                  </h2>
                  <p className="text-neutral-charcoal/80 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Data Types We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-neutral-charcoal mb-6">
              Types of Data We Collect
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-charcoal mb-3">Personal Information</h3>
                <ul className="space-y-2 text-neutral-charcoal/80">
                  <li>• Name and contact details</li>
                  <li>• Email address and phone number</li>
                  <li>• Company information</li>
                  <li>• Project specifications</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-charcoal mb-3">Technical Information</h3>
                <ul className="space-y-2 text-neutral-charcoal/80">
                  <li>• IP address and browser type</li>
                  <li>• Website usage patterns</li>
                  <li>• Device information</li>
                  <li>• Cookies and tracking data</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-luxury-gold/10 to-luxury-bronze/10 rounded-2xl p-8 border border-luxury-gold/20"
          >
            <h2 className="text-2xl font-bold text-neutral-charcoal mb-4">
              Contact Us About Privacy
            </h2>
            <p className="text-neutral-charcoal/80 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-luxury-gold" />
                <div>
                  <p className="font-semibold text-neutral-charcoal">Email</p>
                  <p className="text-neutral-charcoal/80">privacy@almasceram.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-luxury-gold" />
                <div>
                  <p className="font-semibold text-neutral-charcoal">Phone</p>
                  <p className="text-neutral-charcoal/80">+98 (XXX) XXX-XXXX</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/50 rounded-lg">
              <p className="text-sm text-neutral-charcoal/70">
                <strong>Data Protection Officer:</strong> Our Data Protection Officer can be reached at dpo@almasceram.com for any privacy-related concerns or requests.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
