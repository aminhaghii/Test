import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Square, Maximize2, LogIn, LogOut, User, Boxes, LayoutGrid } from "lucide-react";
import FlowingMenu from "./FlowingMenu";
import kitchenImg from "@/assets/inspiration-kitchen.jpg";
import bathroomImg from "@/assets/hero-luxury-bathroom.jpg";
import interiorsImg from "@/assets/inspiration-hotel-lobby.jpg";
import { useAuth } from "@/contexts/BackendAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import toast from "react-hot-toast";

const wallTilesImg = "/images/wall-tiles.jpg";
const floorTilesImg = "/images/floor-tiles.webp";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const aboutTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

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

  // Close overlays on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isProductsOpen && menuRef.current && !menuRef.current.contains(target)) {
        setIsProductsOpen(false);
      }
      if (isAboutOpen && aboutRef.current && !aboutRef.current.contains(target)) {
        setIsAboutOpen(false);
      }
    };

    if (isProductsOpen || isAboutOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProductsOpen, isAboutOpen, isMobileMenuOpen]);

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

  // ESC to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isProductsOpen) setIsProductsOpen(false);
        if (isAboutOpen) setIsAboutOpen(false);
      }
    };

    if (isProductsOpen || isAboutOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isProductsOpen, isAboutOpen]);

  const clearAboutTimer = () => {
    if (aboutTimerRef.current) {
      window.clearTimeout(aboutTimerRef.current);
      aboutTimerRef.current = null;
    }
  };

  const startAboutCloseDelay = () => {
    clearAboutTimer();
    aboutTimerRef.current = window.setTimeout(() => setIsAboutOpen(false), 150);
  };

  const navItems = [
    { label: t('nav.products'), href: "/products" },
    { label: t('nav.inspiration'), href: "/inspiration" },
    { label: t('nav.contact'), href: "/contact" },
    { label: t('nav.catalogues'), href: "/catalogues" },
    { label: t('nav.about'), href: "/about" },
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
              <div className="flex items-center gap-5 text-white/80">
                <span className="hidden md:block">|</span>
                <a href="tel:021-88218520" className="hidden md:block hover:text-luxury-gold transition-smooth">
                  021-88218520
                </a>
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.filter(n=>n.label !== t('nav.about')).map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onMouseEnter={() => {
                    if (item.href === '/products') {
                      setIsAboutOpen(false);
                    }
                  }}
                  onMouseDown={(e) => {
                    if (item.href === "/products") {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsProductsOpen(true);
                      setIsAboutOpen(false);
                    }
                  }}
                  onClick={(e) => {
                    if (item.href === "/products") {
                      e.preventDefault();
                      setIsProductsOpen(true);
                      setIsAboutOpen(false);
                    } else {
                      navigate(item.href);
                    }
                  }}
                  aria-expanded={item.href === '/products' ? isProductsOpen : undefined}
                  className={`text-[15px] font-medium tracking-wide relative group py-2 transition-all duration-300 ${
                    isScrolled 
                      ? "text-neutral-graphite hover:text-luxury-gold" 
                      : "text-white/95 hover:text-luxury-gold"
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-luxury-gold to-luxury-bronze transition-all duration-400 group-hover:w-full rounded-full" />
                  <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-luxury-gold/30 blur-sm transition-all duration-400 group-hover:w-full" />
                </button>
              ))}

              {/* About with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => { clearAboutTimer(); setIsAboutOpen(true); setIsProductsOpen(false); }}
                onMouseLeave={startAboutCloseDelay}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearAboutTimer();
                    setIsAboutOpen((v)=>!v);
                    setIsProductsOpen(false);
                  }}
                  className={`text-[15px] font-medium tracking-wide relative group py-2 transition-all duration-300 ${
                    isScrolled 
                      ? "text-neutral-graphite hover:text-luxury-gold" 
                      : "text-white/95 hover:text-luxury-gold"
                  }`}
                >
                  {t('nav.about')}
                  <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-luxury-gold to-luxury-bronze transition-all duration-400 group-hover:w-full rounded-full" />
                  <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-luxury-gold/30 blur-sm transition-all duration-400 group-hover:w-full" />
                </button>

                {isAboutOpen && (
                  <div
                    ref={aboutRef}
                    className={`absolute left-0 top-full mt-0 origin-top-left transform transition-all duration-150 ease-out`}
                    onMouseEnter={clearAboutTimer}
                    onMouseLeave={startAboutCloseDelay}
                  >
                    <div className="bg-background/95 backdrop-blur-md border border-neutral-stone/40 shadow-2xl rounded-xl p-3 min-w-[360px] scale-100 opacity-100 ring-1 ring-luxury-gold/10">
                      <div className="grid grid-cols-2 gap-2">
                        <a href="/about#overview" onClick={()=>setIsAboutOpen(false)} className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-luxury-gold/15 hover:to-luxury-bronze/15 hover:text-neutral-charcoal hover:border hover:border-luxury-gold/40">{t('about.overview')}</a>
                        <a href="/about#story" onClick={()=>setIsAboutOpen(false)} className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-luxury-gold/15 hover:to-luxury-bronze/15 hover:text-neutral-charcoal hover:border hover:border-luxury-gold/40">{t('about.story')}</a>
                        <a href="/about#milestones" onClick={()=>setIsAboutOpen(false)} className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-luxury-gold/15 hover:to-luxury-bronze/15 hover:text-neutral-charcoal hover:border hover:border-luxury-gold/40">{t('about.milestones')}</a>
                        <a href="/about#capabilities" onClick={()=>setIsAboutOpen(false)} className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-luxury-gold/15 hover:to-luxury-bronze/15 hover:text-neutral-charcoal hover:border hover:border-luxury-gold/40">{t('about.capabilities')}</a>
                        <a href="/about#certifications" onClick={()=>setIsAboutOpen(false)} className="px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-luxury-gold/15 hover:to-luxury-bronze/15 hover:text-neutral-charcoal hover:border hover:border-luxury-gold/40">{t('about.certifications')}</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button className={`p-2.5 rounded-full transition-all duration-300 group hover:scale-110 ${
                isScrolled 
                  ? "text-neutral-graphite hover:bg-luxury-gold/10" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                <Search className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
              
              <LanguageSelector />
              
              <Link to="/contact">
                <Button
                  className={`px-6 py-5 rounded-full font-semibold text-sm tracking-widest transition-all duration-400 shadow-lg hover:shadow-2xl hover:scale-105 ${
                    isScrolled
                      ? "bg-luxury-gold text-neutral-charcoal hover:bg-luxury-bronze border-2 border-luxury-gold hover:border-luxury-bronze"
                      : "bg-luxury-gold/95 text-neutral-charcoal hover:bg-luxury-gold backdrop-blur-sm border-2 border-luxury-gold"
                  }`}
                >
                  {t('nav.contact').toUpperCase()}
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  {/* User/Admin Display */}
                  <div className="flex items-center gap-2 text-sm">
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => navigate('/admin')}
                        className="px-3 py-1.5 rounded-full bg-transparent border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                        title={t('nav.goToAdmin')}
                      >
                        {t('nav.admin')}
                      </button>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-luxury-gold" />
                        <span className="text-neutral-charcoal font-medium">
                          {user.name || user.email}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Logout Button */}
                  <Button
                    onClick={handleLogout}
                    className={`px-6 py-5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
                      isScrolled
                        ? "bg-transparent text-neutral-charcoal border border-neutral-300 hover:bg-neutral-100"
                        : "bg-transparent text-white border border-white/60 hover:bg-white/10"
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('common.logout').toUpperCase()}
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    className={`px-6 py-5 rounded-full font-semibold text-sm tracking-wide transition-all duration-400 shadow-lg hover:shadow-xl hover:scale-105 ${
                      isScrolled
                        ? "bg-gradient-to-r from-luxury-bronze to-luxury-brass text-white hover:from-luxury-brass hover:to-luxury-gold"
                        : "bg-gradient-to-r from-luxury-gold to-luxury-bronze text-neutral-charcoal hover:from-luxury-brass hover:to-luxury-gold backdrop-blur-sm"
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('common.login').toUpperCase()}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle navigation"
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                isScrolled ? 'border-neutral-300 text-neutral-700' : 'border-white/70 text-white'
              }`}
              onClick={() => {
                setIsMobileMenuOpen((v)=>!v);
                setIsProductsOpen(false);
                setIsAboutOpen(false);
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
              {navItems.filter(n=>n.href !== '/about').map((item) => (
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
                  <a href="/about#overview" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.overview')}</a>
                  <a href="/about#story" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.story')}</a>
                  <a href="/about#milestones" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.milestones')}</a>
                  <a href="/about#capabilities" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.capabilities')}</a>
                  <a href="/about#certifications" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.certifications')}</a>
                  <a href="/about#downloads" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-white">{t('about.downloads')}</a>
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
      {/* Products Flowing Menu Overlay (moved outside header) */}
      {isProductsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsProductsOpen(false)}
          />
          {/* Content wrapper */}
          <div className="relative w-full max-w-5xl mx-6">
            {/* Panel */}
            <div ref={menuRef} className="w-full max-h-[85vh] bg-black/90 backdrop-blur-md rounded-3xl overflow-y-auto overflow-x-hidden border border-neutral-stone/40 shadow-2xl p-6 md:p-8">
              {/* FlowingMenu */}
              <FlowingMenu
                items={[
                  {
                    link: "/products",
                    text: t('nav.allProducts'),
                    image: floorTilesImg,
                  },
                  { 
                    link: "/products", 
                    text: t('nav.byDimension'), 
                    image: wallTilesImg,
                    subsections: [
                      {
                        title: "30x30",
                        items: [
                          { label: "30x30 cm", icon: <LayoutGrid size={16} />, link: "/products/dimension/30x30" },
                        ],
                      },
                      {
                        title: "30x90",
                        items: [
                          { label: "30x90 cm", icon: <LayoutGrid size={16} className="rotate-90" />, link: "/products/dimension/30x90" },
                        ],
                      },
                      {
                        title: "40x40",
                        items: [
                          { label: "40x40 cm", icon: <LayoutGrid size={18} />, link: "/products/dimension/40x40" },
                        ],
                      },
                      {
                        title: "40x100",
                        items: [
                          { label: "40x100 cm", icon: <LayoutGrid size={16} className="rotate-90" />, link: "/products/dimension/40x100" },
                        ],
                      },
                      {
                        title: "60x60",
                        items: [
                          { label: "60x60 cm", icon: <LayoutGrid size={20} />, link: "/products/dimension/60x60" },
                        ],
                      },
                      {
                        title: "60x120",
                        items: [
                          { label: "60x120 cm", icon: <LayoutGrid size={18} className="rotate-90" />, link: "/products/dimension/60x120" },
                        ],
                      },
                      {
                        title: "80x80",
                        items: [
                          { label: "80x80 cm", icon: <LayoutGrid size={22} />, link: "/products/dimension/80x80" },
                        ],
                      },
                      {
                        title: "100x100",
                        items: [
                          { label: "100x100 cm", icon: <LayoutGrid size={24} />, link: "/products/dimension/100x100" },
                        ],
                      },
                    ],
                  },
                  { 
                    link: "/products", 
                    text: t('nav.byMaterial'), 
                    image: kitchenImg,
                    subsections: [
                      {
                        title: t('products.filterBySurface'),
                        items: [
                          { label: "Matt" },
                          { label: "Polished" },
                          { label: "Textured" },
                          { label: "Glossy" },
                          { label: "Satin" },
                        ],
                      },
                      {
                        title: t('products.bodyMaterial'),
                        items: [
                          { label: "Ceramic" },
                          { label: "Porcelain" },
                          { label: "Marble" },
                          { label: "Granite" },
                          { label: "Quartz" },
                        ],
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Navigation;

