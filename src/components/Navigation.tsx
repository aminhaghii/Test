import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Square, Maximize2, LogIn, LogOut, User, Boxes, LayoutGrid } from "lucide-react";
import { useAuth } from "@/contexts/BackendAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import toast from "react-hot-toast";
import StaggeredMenu from "./StaggeredMenu";

// API URL for backend resources
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Available dimensions
const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, currentLanguage, setLanguage } = useLanguage();

  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('common.logoutSuccess'));
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('common.logoutFailed'));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu, language dropdown, and products dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isMobileMenuOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      // close language dropdown if clicked outside
      if (isLangOpen && langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      // close products dropdown if clicked outside
      if (isProductsOpen && productsRef.current && !productsRef.current.contains(target)) {
        setIsProductsOpen(false);
      }
    };

    if (isMobileMenuOpen || isLangOpen || isProductsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isLangOpen, isProductsOpen]);

  // Lock body scroll and trap focus when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const drawer = mobileDrawerRef.current;
        if (!drawer) return;
        const focusableSelectors = [
          'a[href]',
          'button:not([disabled])',
          'textarea',
          'input',
          'select',
          '[tabindex]:not([tabindex="-1"])',
        ];
        const focusables = Array.from(
          drawer.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
        ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = (document.activeElement as HTMLElement) || null;
        if (e.shiftKey) {
          if (active === first || !drawer.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !drawer.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // ESC to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileMenuOpen]);

  // Build menu items for StaggeredMenu
  const buildMenuItems = () => {
    const items: { label: string; link: string; ariaLabel: string; onClick?: () => void }[] = [
      { label: t('nav.inspiration'), link: "/inspiration", ariaLabel: t('nav.inspiration') },
      { label: t('nav.catalogues'), link: "/catalogues", ariaLabel: t('nav.catalogues') },
      { label: t('nav.about'), link: "/about", ariaLabel: t('nav.about') },
      { label: t('about.overview'), link: "/about#overview", ariaLabel: t('about.overview') },
      { label: t('about.story'), link: "/about#story", ariaLabel: t('about.story') },
      { label: t('about.milestones'), link: "/about#milestones", ariaLabel: t('about.milestones') },
      { label: t('about.capabilities'), link: "/about#capabilities", ariaLabel: t('about.capabilities') },
      { label: t('about.certifications'), link: "/about#certifications", ariaLabel: t('about.certifications') },
      { label: t('about.exportServices'), link: "/about/export", ariaLabel: t('about.exportServices') },
      { label: t('about.smartCombinations'), link: "/about/combination", ariaLabel: t('about.smartCombinations') },
      { label: t('nav.contact'), link: "/contact", ariaLabel: t('nav.contact') },
    ];

    // Language options moved to header (compact)

    // Add login/admin/logout
    if (user) {
      if (user.role === 'admin') {
        items.push({
          label: t('nav.admin'),
          link: "/admin",
          ariaLabel: t('nav.goToAdmin')
        });
      }
      items.push({
        label: t('common.logout'),
        link: "#",
        ariaLabel: t('common.logout'),
        onClick: handleLogout
      });
    } else {
      items.push({
        label: t('common.login'),
        link: "/login",
        ariaLabel: t('common.login')
      });
    }

    return items;
  };

  // Simple mobile items (no submenu)
  const mobileNavItems = [
    { label: t('nav.products'), href: "/products" },
    { label: t('nav.inspiration'), href: "/inspiration" },
    { label: t('nav.catalogues'), href: "/catalogues" },
    { label: t('nav.about'), href: "/about" },
    { label: t('nav.contact'), href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/98 backdrop-blur-xl shadow-elegant border-b border-neutral-stone/40"
            : "bg-gradient-to-b from-black/40 via-black/20 to-transparent"
        }`}
      >
        {/* Top Bar - Only visible when not scrolled */}
        <div
          className={`border-b border-white/10 transition-all duration-500 ${
            isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
          }`}
        >
          <div className="container mx-auto px-6 lg:px-20">
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="flex items-center gap-6 text-white/80">
                <span className="flex items-center gap-2 hover:text-luxury-gold transition-smooth cursor-pointer">
                  <MapPin className="w-3.5 h-3.5" />
                  {t('nav.showroom')}
                </span>
                <span className="hidden md:block"></span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="hidden md:block">|</span>
                <a href="tel:021-88218520" className="hidden md:block hover:text-luxury-gold transition-smooth">
                  021-88218520
                </a>
                {/* Language dropdown (top bar, right) */}
                <div ref={langRef} className="relative ml-2 z-[100]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsLangOpen(v=>!v);
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isLangOpen}
                    className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto"
                    title="Select language"
                  >
                    {currentLanguage?.toUpperCase() || 'EN'}
                  </button>
                  {isLangOpen && (
                    <ul
                      role="listbox"
                      className="absolute right-0 mt-2 w-36 rounded-md border border-white/20 bg-white text-neutral-charcoal shadow-lg overflow-hidden z-[100] pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        { code: 'en', label: 'EN — English' },
                        { code: 'fa', label: 'FA — فارسی' },
                        { code: 'ar', label: 'AR — العربية' },
                        { code: 'es', label: 'ES — Español' },
                        { code: 'it', label: 'IT — Italiano' },
                      ].map(lang => (
                        <li 
                          key={lang.code} 
                          role="option" 
                          aria-selected={currentLanguage===lang.code}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100 transition-colors ${currentLanguage===lang.code ? 'font-semibold bg-neutral-50' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLanguage(lang.code as any);
                            setIsLangOpen(false);
                          }}
                        >
                          {lang.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Hamburger menu - removed from top bar */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between h-20 lg:h-24 relative">
            {/* Logo */}
            <Link to="/" className="flex items-center z-50 group">
              <span
                className={`font-display uppercase text-2xl lg:text-3xl font-bold tracking-tighter transition-all duration-300 ${
                  isScrolled ? "text-neutral-charcoal" : "text-white"
                }`}
                style={{ letterSpacing: "-0.04em" }}
              >
                Almas<span className="text-luxury-gold group-hover:tracking-wider transition-all duration-300">Ceram</span>
              </span>
            </Link>

            {/* Desktop Navigation - empty */}
            <div className="hidden lg:flex items-center justify-end" />

            {/* Right Side - Products Dropdown, Hamburger Menu and Mobile Button */}
            <div className="flex items-center gap-6">
              {/* Products Full-Screen Overlay */}
              <div 
                ref={productsRef} 
                className="relative z-[100]"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isScrolled 
                      ? "text-neutral-charcoal hover:bg-neutral-100" 
                      : "text-white/95 hover:bg-white/10"
                  }`}
                >
                  {t('nav.products')}
                </button>
                <div 
                  className={`fixed inset-x-0 top-20 lg:top-24 bottom-0 z-[99] transition-all duration-500 ease-out ${
                    isProductsOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="container mx-auto px-6 lg:px-20 pt-12 pb-8 h-full flex items-start">
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto transition-all duration-700 ease-out ${
                      isProductsOpen 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}>
                        {/* All Products */}
                        <Link
                          to="/products"
                          onClick={() => setIsProductsOpen(false)}
                          className="group relative h-96 border-2 border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          {/* Background Image */}
                          <img
                            src={`${API_URL}/ALMAS/505d109c-c3ce-42ef-8cc1-9499265a2d7d.png`}
                            alt="All Products"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                            <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-luxury-gold transition-colors">
                              {t('nav.allProducts') || 'All Products'}
                            </h3>
                            <p className="text-white/90 text-lg mb-6">
                              {t('products.allProductsDesc') || 'Explore our complete collection of premium ceramic tiles'}
                            </p>
                            <div className="w-16 h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                          </div>
                        </Link>

                        {/* By Dimension */}
                        <div 
                          className="group relative h-96 border-2 border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                          onClick={() => setShowDimensions(!showDimensions)}
                        >
                          {/* Background Image */}
                          <img
                            src={`${API_URL}/ALMAS/08c067af-77ef-48f5-a51a-2fe5256da93e.png`}
                            alt="By Dimension"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          
                          {/* Default Content */}
                          {!showDimensions && (
                            <div className="absolute inset-0 flex flex-col justify-end p-8 z-10 transition-opacity duration-300">
                              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-luxury-gold transition-colors">
                                {t('products.byDimension') || 'By Dimension'}
                              </h3>
                              <p className="text-white/90 text-lg mb-6">
                                {t('products.byDimensionDesc') || 'Find tiles by size: 30x30, 60x60, 60x120 and more'}
                              </p>
                              <div className="w-16 h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                            </div>
                          )}
                          
                          {/* Dimensions Grid - appears on click */}
                          {showDimensions && (
                            <div className="absolute inset-0 flex flex-col justify-center items-center p-8 z-10">
                              <h3 className="text-2xl font-bold mb-6 text-white text-center animate-fade-in-up">
                                {t('products.byDimension') || 'By Dimension'}
                              </h3>
                              <div className="grid grid-cols-4 gap-3 w-full max-w-md">
                                {dimensions.map((dim, index) => (
                                  <button
                                    key={dim}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsProductsOpen(false);
                                      setShowDimensions(false);
                                      navigate(`/products?dimension=${dim}`);
                                    }}
                                    className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 hover:scale-110 hover:border-white/40 transition-all duration-200 transform opacity-0 animate-fade-in-up"
                                    style={{ 
                                      animationDelay: `${index * 50}ms`,
                                      animationFillMode: 'forwards'
                                    }}
                                  >
                                    {dim}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* By Material */}
                        <button
                          onClick={() => {
                            setIsProductsOpen(false);
                            navigate('/products?openFilter=material');
                          }}
                          className="group relative h-96 border-2 border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          {/* Background Image */}
                          <img
                            src={`${API_URL}/ALMAS/f65620a0-45d0-411c-bc06-fa01ae497157.png`}
                            alt="By Material"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                            <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-luxury-gold transition-colors">
                              {t('products.byMaterial') || 'By Material'}
                            </h3>
                            <p className="text-white/90 text-lg mb-6">
                              {t('products.byMaterialDesc') || 'Browse by material type: Porcelain, White Body and more'}
                            </p>
                            <div className="w-16 h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                          </div>
                        </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Hash Line - thinner but longer */}
              <div className={`hidden md:block h-[1px] w-16 lg:w-24 transition-all duration-300 ${
                isScrolled ? "bg-neutral-300/40" : "bg-white/30"
              }`} />

              {/* Hamburger Menu - StaggeredMenu */}
              <div className="relative z-[101]">
                <StaggeredMenu
                  position="right"
                  colors={['#1e1e22', '#35353c']}
                  items={buildMenuItems()}
                  displaySocials={false}
                  displayItemNumbering={true}
                  menuButtonColor={isScrolled ? '#1e1e22' : '#fff'}
                  openMenuButtonColor={isScrolled ? '#1e1e22' : '#fff'}
                  accentColor="#D4AF37"
                  changeMenuColorOnOpen={false}
                  isFixed={false}
                  inline={true}
                  onMenuOpen={() => { 
                    setIsMobileMenuOpen(false);
                    setIsLangOpen(false);
                    setIsProductsOpen(false);
                  }}
                  onMenuClose={() => {}}
                />
              </div>

              {/* Mobile Menu Button - fallback for small screens */}
              <button
                aria-label="Toggle navigation"
                className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                  isScrolled ? 'border-neutral-300 text-neutral-700' : 'border-white/70 text-white'
                }`}
                onClick={() => {
                  setIsMobileMenuOpen((v)=>!v);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[80]" aria-hidden={!isMobileMenuOpen}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          {/* Drawer */}
          <div
            id="mobile-nav-drawer"
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-xl rounded-b-2xl p-4 pt-[calc(80px+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)]"
          >
            <nav className="space-y-2" aria-label="Primary">
              {mobileNavItems.map((item) => (
                <button
                  key={item.href}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-white"
                  onClick={() => { setIsMobileMenuOpen(false); navigate(item.href); }}
                >
                  {item.label}
                </button>
              ))}

              <div className="mt-3">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">{t('nav.about')}</div>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'overview';
                      } else {
                        window.location.hash = 'overview';
                        const element = document.getElementById('overview');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.overview')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'story';
                      } else {
                        window.location.hash = 'story';
                        const element = document.getElementById('story');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.story')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'milestones';
                      } else {
                        window.location.hash = 'milestones';
                        const element = document.getElementById('milestones');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.milestones')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'capabilities';
                      } else {
                        window.location.hash = 'capabilities';
                        const element = document.getElementById('capabilities');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.capabilities')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'certifications';
                      } else {
                        window.location.hash = 'certifications';
                        const element = document.getElementById('certifications');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.certifications')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname !== '/about') {
                        navigate('/about');
                        window.location.hash = 'downloads';
                      } else {
                        window.location.hash = 'downloads';
                        const element = document.getElementById('downloads');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white text-left"
                  >
                    {t('about.downloads')}
                  </button>
                </div>
                <div className="px-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a href="/about/export" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors">{t('about.exportServices')}</a>
                  <a href="/about/combination" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors">{t('about.smartCombinations')}</a>
                </div>
              </div>

              <div className="pt-4 px-2 mb-3">
                <LanguageSelector />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 px-2">
                <button
                  className="px-4 py-3 rounded-xl bg-luxury-gold text-neutral-charcoal font-semibold"
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/contact'); }}
                >
                  {t('nav.contact')}
                </button>
                {user ? (
                  <button
                    className="px-4 py-3 rounded-xl border border-white/20 text-white"
                    onClick={() => { setIsMobileMenuOpen(false); navigate(user.role === 'admin' ? '/admin' : '/'); }}
                  >
                    {user.role === 'admin' ? t('common.admin') : t('common.account')}
                  </button>
                ) : (
                  <button
                    className="px-4 py-3 rounded-xl border border-white/20 text-white"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                  >
                    {t('common.login')}
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;

