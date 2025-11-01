import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, Globe, Scale, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using Almas Kavir Rafsanjan's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: Users,
      title: "User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account."
    },
    {
      icon: Shield,
      title: "Privacy and Data Protection",
      content: "We are committed to protecting your privacy. Your personal information will be used in accordance with our Privacy Policy. We implement appropriate security measures to protect your data against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: Globe,
      title: "Intellectual Property",
      content: "All content, trademarks, service marks, trade names, logos, and other intellectual property displayed on this website are the property of Almas Kavir Rafsanjan or its licensors. You may not use, reproduce, or distribute any content without our written permission."
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: "Almas Kavir Rafsanjan shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service."
    },
    {
      icon: CheckCircle,
      title: "Governing Law",
      content: "These terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Iran. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kerman Province, Iran."
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
              Terms of Service
            </h1>
            <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By using our website, you agree to be bound by these terms.
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

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-luxury-gold/10 to-luxury-bronze/10 rounded-2xl p-8 border border-luxury-gold/20"
          >
            <h2 className="text-2xl font-bold text-neutral-charcoal mb-4">
              Contact Us
            </h2>
            <p className="text-neutral-charcoal/80 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-neutral-charcoal">Almas Kavir Rafsanjan</p>
                <p className="text-neutral-charcoal/80">Rafsanjan, Kerman Province, Iran</p>
                <p className="text-neutral-charcoal/80">Email: info@almasceram.com</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-charcoal">Phone</p>
                <p className="text-neutral-charcoal/80">+98 (XXX) XXX-XXXX</p>
                <p className="text-neutral-charcoal/80">Business Hours: 8:00 AM - 6:00 PM (IRST)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
