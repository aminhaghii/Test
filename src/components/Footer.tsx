import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gradient-to-br from-neutral-charcoal via-gray-900 to-neutral-charcoal text-white">
      <div className="container mx-auto px-6 lg:px-20 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-6">
              ALMAS<span className="text-luxury-gold">CERAM</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-luxury-gold flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-luxury-gold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-luxury-gold">{t('footer.products')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/products?surface=Matt" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  Matt {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/products?surface=Polished" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  Polished {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/products?surface=Trans" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  Transparent {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></span>
                  {t('nav.allProducts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-luxury-gold">{t('contact.title')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  10km Rafsanjan-Kerman Road<br />
                  Rafsanjan, Kerman Province
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <a href="tel:+982188218520" className="hover:text-luxury-gold transition-colors">
                  +98 21-88218520
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <a href="mailto:info@almasceram.com" className="hover:text-luxury-gold transition-colors">
                  info@almasceram.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Almas Kavir Rafsanjan. {t('footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-luxury-gold transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-luxury-gold transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;