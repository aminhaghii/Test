import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Square, Maximize2, LogIn, LogOut, User, Boxes, LayoutGrid } from "lucide-react";
import { useAuth } from "@/contexts/BackendAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import toast from "react-hot-toast";
import StaggeredMenu from "./StaggeredMenu";
import BrandLogo from "@/components/BrandLogo";

// API URL for backend resources
import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

// Available dimensions
const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];

// Available materials
const materials = ['White Body', 'Porcelain'];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const scrollRAF = useRef<number>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, currentLanguage, setLanguage } = useLanguage();

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
      const current = window.scrollY;
      setIsScrolled(current > 20);

      if (scrollRAF.current) {
        cancelAnimationFrame(scrollRAF.current);
      }

      scrollRAF.current = requestAnimationFrame(() => {
        const delta = current - lastScrollY.current;

        if (current < 40) {
          setShowHeader(true);
        } else if (delta > 6) {
          setShowHeader(false);
        } else if (delta < -6) {
          setShowHeader(true);
        }

        lastScrollY.current = current;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRAF.current) {
        cancelAnimationFrame(scrollRAF.current);
      }
    };
  }, []);

  // Close language dropdown and products dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // close language dropdown if clicked outside
      if (isLangOpen && langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      // close products dropdown if clicked outside
      if (isProductsOpen && productsRef.current && !productsRef.current.contains(target)) {
        // Clear timeout and close immediately on click outside
        if (productsTimeoutRef.current) {
          clearTimeout(productsTimeoutRef.current);
          productsTimeoutRef.current = null;
        }
        setIsProductsOpen(false);
        setShowDimensions(false);
        setShowMaterials(false);
      }
    };

    if (isLangOpen || isProductsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setShowHeader(true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup timeout on unmount
      if (productsTimeoutRef.current) {
        clearTimeout(productsTimeoutRef.current);
      }
    };
  }, [isLangOpen, isProductsOpen]);


  // Build menu items for StaggeredMenu
  const buildMenuItems = () => {
    const items: { label: string; link: string; ariaLabel: string; onClick?: () => void }[] = [
      { label: t('nav.products'), link: "/products", ariaLabel: t('nav.products'), onClick: () => navigate('/products') },
      { label: t('nav.inspiration'), link: "/inspiration", ariaLabel: t('nav.inspiration'), onClick: () => navigate('/inspiration') },
      { label: t('nav.catalogues'), link: "/catalogues", ariaLabel: t('nav.catalogues'), onClick: () => navigate('/catalogues') },
      { label: t('nav.blog') || 'Blog', link: "/blog", ariaLabel: t('nav.blog') || 'Blog', onClick: () => navigate('/blog') },
      { label: t('nav.about'), link: "/about", ariaLabel: t('nav.about'), onClick: () => navigate('/about') },
      { label: t('about.exportServices'), link: "/about/export", ariaLabel: t('about.exportServices') },
      { label: t('about.smartCombinations'), link: "/about/combination", ariaLabel: t('about.smartCombinations') },
      { label: t('nav.contact'), link: "/contact", ariaLabel: t('nav.contact') },
    ];

    // Language options moved to header (compact)

    // Add login/admin/logout
    if (user) {
      if (user.role === 'admin') {
        // Use Link for admin panel (no onClick needed, Link handles navigation)
        items.push({
          label: t('nav.admin') || 'Admin Panel',
          link: "/admin",
          ariaLabel: t('nav.goToAdmin') || 'Go to Admin Panel'
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


  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
          isScrolled
            ? "bg-white/80 backdrop-blur-[40px] shadow-elegant border-b border-white/30"
            : "bg-white/95 backdrop-blur-[20px]"
        } ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
        style={isScrolled ? {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.75) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        } : {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >

        {/* Main Navigation */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-20">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 lg:h-24 relative">
            {/* Logo */}
            <Link to="/" className="flex items-center z-50 group">
              <BrandLogo
                eager
                className="h-8 sm:h-9 md:h-10 lg:h-12 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
                alt="Almas Ceram"
              />
            </Link>

            {/* Desktop Navigation - minimal right-side links */}
            <div className="hidden lg:flex items-center justify-end" />

            {/* Right Side - Products Dropdown, Hamburger Menu and Mobile Button */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {/* Products Full-Screen Overlay */}
              <div 
                ref={productsRef} 
                className="relative z-[100] hidden sm:block"
                onMouseEnter={() => {
                  // Clear any pending close timeout
                  if (productsTimeoutRef.current) {
                    clearTimeout(productsTimeoutRef.current);
                    productsTimeoutRef.current = null;
                  }
                  setIsProductsOpen(true);
                }}
                onMouseLeave={() => {
                  // Add delay before closing to allow user to move mouse to overlay
                  productsTimeoutRef.current = setTimeout(() => {
                    setIsProductsOpen(false);
                    setShowDimensions(false);
                    setShowMaterials(false);
                  }, 200); // 200ms delay
                }}
              >
                <button
                  className={`inline-flex items-center px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg font-medium text-xs sm:text-xs md:text-sm transition-all touch-manipulation ${
                    isScrolled 
                      ? "text-neutral-charcoal hover:bg-neutral-100" 
                      : "text-neutral-charcoal hover:bg-neutral-100/70"
                  }`}
                >
                  {t('nav.products')}
                </button>
                
                {/* Overlay Container */}
                <div 
                  className={`fixed inset-x-0 top-14 sm:top-16 md:top-20 lg:top-24 z-[99] bg-white/40 backdrop-blur-lg transition-all duration-500 ease-in-out ${
                    isProductsOpen 
                      ? 'opacity-100 pointer-events-auto visible' 
                      : 'opacity-0 pointer-events-none invisible'
                  }`}
                  style={{
                    height: isProductsOpen ? '550px' : '0',
                    overflow: 'hidden',
                    transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out'
                  }}
                  onMouseEnter={() => {
                    // Clear timeout when mouse enters overlay
                    if (productsTimeoutRef.current) {
                      clearTimeout(productsTimeoutRef.current);
                      productsTimeoutRef.current = null;
                    }
                    setIsProductsOpen(true);
                  }}
                  onMouseLeave={() => {
                    // Add delay before closing
                    productsTimeoutRef.current = setTimeout(() => {
                      setIsProductsOpen(false);
                      setShowDimensions(false);
                      setShowMaterials(false);
                    }, 200);
                  }}
                >
                  <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-20 h-full flex items-center justify-center overflow-hidden py-6 sm:py-8">
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mx-auto ${
                      isProductsOpen 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    } transition-opacity duration-500 ease-in-out`}
                    style={{
                      transitionDelay: isProductsOpen ? '0.15s' : '0s'
                    }}>
                        {/* All Products */}
                        <Link
                          to="/products"
                          onClick={() => setIsProductsOpen(false)}
                          className="group relative h-[400px] md:h-[420px] lg:h-[450px] border-2 border-neutral-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl touch-manipulation"
                        >
                          {/* Background Image */}
                          <img
                            src={getImageUrl('/ALMAS/505d109c-c3ce-42ef-8cc1-9499265a2d7d.png')}
                            alt="All Products"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8 z-10">
                            <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-2.5 md:mb-3 text-white">
                              {t('nav.allProducts') || 'All Products'}
                            </h3>
                            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6">
                              {t('products.allProductsDesc') || 'Explore our complete collection of premium ceramic tiles'}
                            </p>
                            <div className="w-12 sm:w-14 md:w-16 h-0.5 sm:h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                          </div>
                        </Link>

                        {/* By Dimension */}
                        <div 
                          className="group relative h-[400px] md:h-[420px] lg:h-[450px] border-2 border-neutral-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl touch-manipulation"
                          onClick={() => setShowDimensions(!showDimensions)}
                        >
                          {/* Background Image */}
                          <img
                            src={getImageUrl('/ALMAS/08c067af-77ef-48f5-a51a-2fe5256da93e.png')}
                            alt="By Dimension"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          
                          {/* Default Content */}
                          {!showDimensions && (
                            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8 z-10 transition-opacity duration-300">
                              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-2.5 md:mb-3 text-white">
                                {t('products.byDimension') || 'By Dimension'}
                              </h3>
                              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6">
                                {t('products.byDimensionDesc') || 'Find tiles by size: 30x30, 60x60, 60x120 and more'}
                              </p>
                              <div className="w-12 sm:w-14 md:w-16 h-0.5 sm:h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                            </div>
                          )}
                          
                          {/* Dimensions Grid - appears on click */}
                          {showDimensions && (
                            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 z-10 overflow-y-auto -webkit-overflow-scrolling-touch">
                              <div className="w-full max-w-lg backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 p-4 sm:p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.25)] bg-transparent">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-white text-center animate-fade-in-up">
                                  {t('products.byDimension') || 'By Dimension'}
                                </h3>
                                <div className="grid grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
                                  {dimensions.map((dim, index) => (
                                    <button
                                      key={dim}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProductsOpen(false);
                                        setShowDimensions(false);
                                        navigate(`/products?dimension=${dim}`);
                                      }}
                                      className="w-full aspect-square flex items-center justify-center bg-white/10 border border-white/20 rounded-md sm:rounded-lg text-white text-xs sm:text-xs md:text-sm font-medium hover:bg-white/20 hover:scale-110 hover:border-white/40 transition-all duration-200 transform opacity-0 animate-fade-in-up touch-manipulation"
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
                  </div>
                )}
              </div>
              
                        {/* By Material */}
                        <div 
                          className="group relative h-[400px] md:h-[420px] lg:h-[450px] border-2 border-neutral-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl touch-manipulation"
                          onClick={() => setShowMaterials(!showMaterials)}
                        >
                          {/* Background Image */}
                          <img
                            src={getImageUrl('/ALMAS/f65620a0-45d0-411c-bc06-fa01ae497157.png')}
                            alt="By Material"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          
                          {/* Default Content */}
                          {!showMaterials && (
                            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8 z-10 transition-opacity duration-300">
                              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-2.5 md:mb-3 text-white">
                                {t('products.byMaterial') || 'By Material'}
                              </h3>
                              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6">
                                {t('products.byMaterialDesc') || 'Browse by material type: Porcelain, White Body and more'}
                              </p>
                              <div className="w-12 sm:w-14 md:w-16 h-0.5 sm:h-1 bg-white transform group-hover:scale-x-125 transition-transform origin-left" />
                            </div>
                          )}
                          
                          {/* Materials Grid - appears on click */}
                          {showMaterials && (
                            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 z-10 overflow-y-auto -webkit-overflow-scrolling-touch">
                              <div className="w-full max-w-md backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 p-4 sm:p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.25)] bg-transparent">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-white text-center animate-fade-in-up">
                                  {t('products.byMaterial') || 'By Material'}
                                </h3>
                                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                                  {materials.map((material, index) => (
                      <button
                                      key={material}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProductsOpen(false);
                                        setShowMaterials(false);
                                        navigate(`/products?bodyType=${material}`);
                                      }}
                                      className="w-full aspect-square flex items-center justify-center bg-white/10 border border-white/20 rounded-md sm:rounded-lg text-white text-sm sm:text-sm md:text-base font-medium hover:bg-white/20 hover:scale-110 hover:border-white/40 transition-all duration-200 transform opacity-0 animate-fade-in-up touch-manipulation"
                                      style={{
                                        animationDelay: `${index * 80}ms`,
                                        animationFillMode: 'forwards'
                                      }}
                                    >
                                      {material}
                      </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <Link
                to="/contact"
                className={`hidden lg:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      isScrolled
                    ? 'text-neutral-charcoal hover:text-neutral-600'
                    : 'text-neutral-charcoal hover:text-neutral-600'
                    }`}
                  >
                {t('nav.contact')}
                </Link>

              {/* Language dropdown - moved next to hamburger */}
              <div ref={langRef} className="relative z-[100]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsLangOpen(v=>!v);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isLangOpen}
                  className={`px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-1.5 md:py-2 rounded-md text-[10px] sm:text-[11px] md:text-xs font-semibold transition-colors cursor-pointer pointer-events-auto touch-manipulation ${
                    isScrolled
                      ? 'text-neutral-charcoal hover:text-neutral-600'
                      : 'text-neutral-charcoal hover:text-neutral-600'
                  }`}
                  title="Select language"
                >
                  {currentLanguage?.toUpperCase() || 'EN'}
                </button>
                {isLangOpen && (
                  <ul
                    role="listbox"
                    className="absolute right-0 mt-1.5 sm:mt-2 w-32 sm:w-36 rounded-md border border-neutral-200 bg-white text-neutral-charcoal shadow-lg overflow-hidden z-[100] pointer-events-auto"
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
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer hover:bg-neutral-100 transition-colors touch-manipulation ${currentLanguage===lang.code ? 'font-semibold bg-neutral-100' : ''}`}
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

              {/* Panel Shortcut */}
              {user && (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/profile-completion'}
                  className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-charcoal text-white hover:bg-neutral-charcoal/90 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  {user.role === 'admin' ? t('nav.admin') || 'Admin Panel' : t('common.profile') || 'My Panel'}
                </Link>
              )}

              {/* Decorative Hash Line - thinner but longer */}
              <div className={`hidden md:block h-[1px] w-12 md:w-16 lg:w-24 transition-all duration-300 ${
                isScrolled ? "bg-neutral-300/40" : "bg-neutral-200"
              }`} />
              {/* Hamburger Menu - StaggeredMenu */}
              <div className="relative z-[50] flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <StaggeredMenu
                  position="right"
                  colors={['#1e1e22', '#35353c']}
                  items={buildMenuItems()}
                  displaySocials={false}
                  displayItemNumbering={true}
                  menuButtonColor="#1e1e22"
                  openMenuButtonColor="#1e1e22"
                  accentColor="#D4AF37"
                  changeMenuColorOnOpen={false}
                  isFixed={false}
                  inline={true}
                  onMenuOpen={() => { 
                    setIsLangOpen(false);
                    setIsProductsOpen(false);
                  }}
                  onMenuClose={() => {}}
                />
              </div>

            </div>

          </div>
        </div>
      </header>

    </>
  );
}

export default Navigation;

