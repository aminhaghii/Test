import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white text-neutral-charcoal">
      {/* بخش اصلی فوتر */}
      <div className="border-t border-gray-200 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-16">
            
            {/* ستون اول: برند و توضیحات */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <div className="footer-logo">
                <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold tracking-wide mb-2 sm:mb-2.5 md:mb-3 text-neutral-charcoal">
                  ALMAS<span className="text-neutral-charcoal">CERAM</span>
                </h2>
              </div>
              <p className="text-sm sm:text-[14px] md:text-[15px] leading-relaxed text-gray-600 max-w-[280px]">
                {t('footer.description') || 'Premium ceramic and porcelain tiles for luxury projects'}
              </p>
          </div>

            {/* ستون دوم: لینک‌های سریع */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <h3 className="text-sm sm:text-sm md:text-base font-semibold uppercase tracking-wider mb-3 sm:mb-4 md:mb-5 text-neutral-charcoal">
                {t('footer.quickLinks') || 'Quick Links'}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 list-none p-0 m-0">
              <li>
                  <Link to="/" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('common.home') || 'Home'}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('footer.about') || 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('footer.products') || 'Products'}
                </Link>
              </li>
              <li>
                  <Link to="/inspiration" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('nav.inspiration') || 'Inspiration'}
                </Link>
              </li>
              <li>
                  <Link to="/blog" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('nav.blog') || 'Blog'}
                </Link>
              </li>
              <li>
                  <Link to="/contact" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('footer.contact') || 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

            {/* ستون سوم: محصولات */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <h3 className="text-sm sm:text-sm md:text-base font-semibold uppercase tracking-wider mb-3 sm:mb-4 md:mb-5 text-neutral-charcoal">
                {t('footer.products') || 'Products'}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 list-none p-0 m-0">
              <li>
                  <Link to="/products?surface=Matt" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    Matt {t('footer.products') || 'Products'}
                </Link>
              </li>
              <li>
                  <Link to="/products?surface=Polished" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    Polished {t('footer.products') || 'Products'}
                </Link>
              </li>
              <li>
                  <Link to="/products?surface=Trans" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    Transparent {t('footer.products') || 'Products'}
                </Link>
              </li>
              <li>
                  <Link to="/products" className="text-sm sm:text-[14px] md:text-[15px] text-gray-600 hover:text-neutral-charcoal transition-all duration-200 inline-block hover:translate-x-1 no-underline touch-manipulation">
                    {t('nav.allProducts') || 'All Products'}
                </Link>
              </li>
            </ul>
          </div>

            {/* ستون چهارم: تماس با ما */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <h3 className="text-sm sm:text-sm md:text-base font-semibold uppercase tracking-wider mb-3 sm:mb-4 md:mb-5 text-neutral-charcoal">
                {t('contact.title') || 'Contact Us'}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4">
                <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-start text-gray-600 text-xs sm:text-xs md:text-sm leading-relaxed">
                  <MapPin size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] flex-shrink-0 mt-0.5 text-neutral-charcoal" />
                  <span>
                  10km Rafsanjan-Kerman Road<br />
                  Rafsanjan, Kerman Province
                </span>
                </div>
                <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-center text-gray-600 text-xs sm:text-xs md:text-sm">
                  <Phone size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] flex-shrink-0 text-neutral-charcoal" />
                  <a href="tel:+982188218520" className="hover:text-neutral-charcoal transition-colors duration-200 no-underline touch-manipulation">
                  +98 21-88218520
                </a>
                </div>
                <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-center text-gray-600 text-xs sm:text-xs md:text-sm">
                  <Mail size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] flex-shrink-0 text-neutral-charcoal" />
                  <a href="mailto:info@almasceram.com" className="hover:text-neutral-charcoal transition-colors duration-200 no-underline touch-manipulation break-all">
                  info@almasceram.com
                </a>
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>

      {/* بخش کپی‌رایت */}
      <div className="border-t border-gray-200 py-4 sm:py-5 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-3.5 md:gap-4">
            <p className="text-xs sm:text-xs md:text-sm text-gray-500 m-0 text-center md:text-left">
              © {new Date().getFullYear()} Almas Kavir Rafsanjan · {t('footer.copyright') || 'All rights reserved'}
            </p>
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-xs md:text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-neutral-charcoal transition-colors duration-200 no-underline touch-manipulation">
                {t('footer.privacy') || 'Privacy Policy'}
              </Link>
              <span className="text-gray-300">·</span>
              <Link to="/terms" className="text-gray-500 hover:text-neutral-charcoal transition-colors duration-200 no-underline touch-manipulation">
                {t('footer.terms') || 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
