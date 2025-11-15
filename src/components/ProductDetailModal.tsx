import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '@/services/productServiceBackend';
import TestReportModal from './TestReportModal';
import { useLanguage } from '@/contexts/LanguageContext';
import MinimalBadgeIcon from './MinimalBadgeIcon';
import { getPackagingInfo } from '@/data/packagingData';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/lib/getApiUrl';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  relatedProducts?: Product[];
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  relatedProducts = []
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isTestReportOpen, setIsTestReportOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const API_URL = getApiUrl();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Reset states when product changes
  }, [product]);

  // Memoize expensive computations - MUST be before any conditional returns
  const { environmentImage, textureImages } = useMemo(() => {
    if (!product) {
      return {
        environmentImage: '',
        textureImages: []
      };
    }
    
    const envImg = product.image_url || '';
    const textures = product.texture_images || [];
    
    return {
      environmentImage: envImg,
      textureImages: textures
    };
  }, [product]);

  const getImageUrl = useMemo(() => {
    return (url: string) => {
      if (!url) return '';
      return url.startsWith('http') ? url : `${API_URL}${url}`;
    };
  }, [API_URL]);

  const formatSpecValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? t('productModal.yes') : t('productModal.no');
    }
    return value;
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-3 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative w-full max-w-[98vw] sm:max-w-[95vw] max-h-[98vh] sm:max-h-[95vh] bg-white overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-neutral-stone/30 px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-neutral-charcoal">{t('productModal.title')}</h1>
                <button
                  onClick={onClose}
                  className="p-1 sm:p-1.5 md:p-2 hover:bg-neutral-slate/10 transition-colors touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-charcoal" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(98vh-3.5rem)] sm:max-h-[calc(98vh-4rem)] md:max-h-[calc(95vh-5rem)] lg:max-h-[calc(95vh-5rem)] -webkit-overflow-scrolling-touch">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Left Side - Product Info */}
                <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                  {/* Product Title */}
                  <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-charcoal leading-tight">{product.name}</h1>
                    <p className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.sku')}: {product.slug}</p>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                    <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.dimension')}</span>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{product.dimension}</p>
                    </div>

                    <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.surface')}</span>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{product.surface}</p>
                    </div>

                    <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.material')}</span>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{product.body_type}</p>
                    </div>

                    {product.color && (
                      <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                        <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.color')}</span>
                        <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{product.color}</p>
                      </div>
                    )}

                    {(product as any).thickness && (
                      <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                        <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.thickness')}</span>
                        <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{(product as any).thickness}mm</p>
                      </div>
                    )}

                    {(product as any).absorption_rate && (
                      <div className="border-b border-neutral-stone/30 pb-1.5 sm:pb-2">
                        <span className="text-[10px] sm:text-xs md:text-sm text-neutral-slate">{t('productModal.absorption')}</span>
                        <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-charcoal mt-0.5 sm:mt-1">{(product as any).absorption_rate}%</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Product Specifications Icons */}
                  <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-neutral-stone/30">
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-neutral-charcoal mb-2 sm:mb-3 md:mb-4 text-center">Specifications</h3>
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
                      {/* Dimension Icon */}
                      <div className="relative group flex flex-col items-center">
                        <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                            <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 9h18M9 3v18" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">DM</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                          {t('productModal.dimension')}: {product.dimension}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                        </div>
                      </div>

                      {/* Surface Icon */}
                      <div className="relative group flex flex-col items-center">
                        <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                            <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 12h18M12 3v18" strokeDasharray="2 2" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">SF</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                          {t('productModal.surface')}: {product.surface}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                        </div>
                      </div>

                      {/* Material Icon */}
                      <div className="relative group flex flex-col items-center">
                        <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                            <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="7" height="7" rx="1" />
                              <rect x="14" y="3" width="7" height="7" rx="1" />
                              <rect x="3" y="14" width="7" height="7" rx="1" />
                              <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">MT</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                          {t('productModal.material')}: {product.body_type}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                        </div>
                      </div>

                      {/* Color Icon */}
                      {product.color && (
                        <div className="relative group flex flex-col items-center">
                          <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                              <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" fill="currentColor" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">Color</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                            {t('productModal.color')}: {product.color}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                          </div>
                        </div>
                      )}

                      {/* Thickness Icon */}
                      {(product as any).thickness && (
                        <div className="relative group flex flex-col items-center">
                          <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                              <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="8" width="18" height="8" rx="1" />
                                <path d="M3 12h18" strokeWidth="3" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">TH</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                            {t('productModal.thickness')}: {(product as any).thickness}mm
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                          </div>
                        </div>
                      )}

                      {/* Absorption Icon */}
                      {(product as any).absorption_rate && (
                        <div className="relative group flex flex-col items-center">
                          <div className="relative cursor-pointer mb-0.5 sm:mb-1">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center shadow-sm group-hover:border-neutral-charcoal/40 transition-colors touch-manipulation">
                              <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-neutral-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                <path d="M12 2.69v8.31" />
                                <path d="M8 12h8" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-charcoal uppercase tracking-wide">AB</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl rounded-md">
                            {t('productModal.absorption')}: {(product as any).absorption_rate}%
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-neutral-charcoal"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Test Report Button */}
                  <button
                    onClick={() => setIsTestReportOpen(true)}
                    className="w-full border border-neutral-stone/30 hover:border-neutral-charcoal text-neutral-charcoal hover:text-neutral-charcoal py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 transition-all duration-200 text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    {t('productModal.testReport')}
                  </button>

                  {/* Description */}
                  {product.description && (
                    <div className="pt-2.5 sm:pt-3 md:pt-4 border-t border-neutral-stone/30">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-charcoal mb-1.5 sm:mb-2 md:mb-3">{t('productModal.description')}</h3>
                      <p className="text-xs sm:text-sm md:text-base text-neutral-slate leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Right Side - Main Image */}
                <div>
                  <div 
                    className="relative w-full aspect-square bg-neutral-slate/10 overflow-hidden cursor-pointer"
                    onClick={() => setLightboxImage(environmentImage)}
                  >
                    <img
                      src={getImageUrl(environmentImage)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:opacity-95 transition-opacity duration-300"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Icons Section */}
              {product.features && product.features.length > 0 && (
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-neutral-stone/30 pt-4 sm:pt-6 md:pt-8">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-charcoal mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">Features & Applications</h2>
                    <div className="flex gap-2 sm:gap-2.5 md:gap-3 flex-wrap justify-center sm:justify-start">
                      {product.features.map((feature, index) => {
                      const featureKey = feature.toLowerCase().replace(/\s+/g, '');
                      const normalized = feature.toLowerCase();
                      
                      // تعیین محتوا و استایل بر اساس feature
                      const getFeatureConfig = () => {
                        // Floor - حروف C/W با خط
                        if (normalized.includes('floor')) {
                          return {
                            content: null,
                            bgColor: '#fff',
                            color: '#222',
                            iconContent: (
                              <g>
                                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontFamily="sans-serif" fontWeight="500" fill="currentColor">C/W</text>
                                <line x1="-8" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" />
                              </g>
                            )
                          };
                        }
                        // Domestic - خانه
                        if (normalized.includes('domestic') || normalized.includes('residential')) {
                          return {
                            content: null,
                            bgColor: '#d3d3d3',
                            color: '#222',
                            iconContent: (
                              <g transform="scale(0.7)">
                                <path d="M12 3L3 12h3v9h6v-6h4v6h6v-9h3L12 3z" fill="currentColor" stroke="none" />
                              </g>
                            )
                          };
                        }
                        // Commercial - کیف خرید
                        if (normalized.includes('commercial') || normalized.includes('light commercial')) {
                          return {
                            content: null,
                            bgColor: '#d3d3d3',
                            color: '#222',
                            iconContent: (
                              <g transform="scale(0.7)">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                              </g>
                            )
                          };
                        }
                        // Rectified - LS یا grid
                        if (normalized.includes('rectified')) {
                          return {
                            content: 'LS',
                            bgColor: '#d3d3d3',
                            color: '#222',
                            iconContent: null
                          };
                        }
                        // Random Faces - N یا grid
                        if (normalized.includes('random') || normalized.includes('faces')) {
                          return {
                            content: 'N',
                            bgColor: '#222',
                            color: '#fff',
                            iconContent: null
                          };
                        }
                        // Default - M
                        return {
                          content: 'M',
                          bgColor: '#d3d3d3',
                          color: '#222',
                          iconContent: null
                        };
                      };

                      const config = getFeatureConfig();

                      return (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <div className="cursor-pointer hover:opacity-80 transition-opacity touch-manipulation">
                            <MinimalBadgeIcon
                              content={config.iconContent || config.content}
                              bgColor={config.bgColor}
                              color={config.color}
                              size={48}
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 sm:mb-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-neutral-charcoal text-white text-[10px] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                            {t(`productModal.features.${featureKey}`) || feature}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 sm:border-l-4 border-r-3 sm:border-r-4 border-t-3 sm:border-t-4 border-transparent border-t-neutral-charcoal"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Texture Images Section */}
              {textureImages.length > 0 && (
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-neutral-stone/30 pt-4 sm:pt-6 md:pt-8">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-charcoal mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">{t('productModal.textureGallery')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {textureImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-neutral-slate/10 overflow-hidden border border-neutral-stone/30 hover:border-neutral-charcoal transition-all cursor-pointer touch-manipulation"
                        onClick={() => setLightboxImage(image)}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${t('productModal.application')} ${index + 1}`}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packaging Information Section - Between Texture and Related Products */}
              {(() => {
                const packagingInfo = getPackagingInfo(product.dimension);
                // Always show packaging info if dimension exists
                if (!packagingInfo) {
                  return null;
                }

                return (
                  <div className="pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 border-t border-neutral-stone/30">
                    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-charcoal mb-4 sm:mb-6 md:mb-8 text-center">{t('packagingInfo.title')}</h3>
                      
                      {/* Single Package Information */}
                      <div className="mb-6 sm:mb-7 md:mb-8">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="relative group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                              <img 
                                src="/Content/box.png" 
                                alt={t('packagingInfo.singlePackage.label')} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 sm:mb-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-neutral-charcoal text-white text-[10px] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                              {t('packagingInfo.singlePackage.label')}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 sm:border-l-4 border-r-3 sm:border-r-4 border-t-3 sm:border-t-4 border-transparent border-t-neutral-charcoal"></div>
                            </div>
                          </div>
                          <h4 className="text-sm sm:text-base font-medium text-neutral-charcoal text-center">{t('packagingInfo.singlePackage.title')}</h4>
                        </div>
                        <div className="border border-neutral-stone/30 max-w-2xl mx-auto overflow-x-auto">
                          <table className="w-full text-xs sm:text-sm min-w-[280px]">
                            <tbody>
                              <tr className="border-b border-neutral-stone/30">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 w-1/2 text-center">{t('packagingInfo.singlePackage.dimension')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.singlePackage.dimension}</td>
                              </tr>
                              <tr className="border-b border-neutral-stone/30">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 text-center">{t('packagingInfo.singlePackage.piecesPerCarton')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.singlePackage.pieces}</td>
                              </tr>
                              <tr className="border-b border-neutral-stone/30">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 text-center">{t('packagingInfo.singlePackage.squareMetersPerCarton')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.singlePackage.squareMeters} m²</td>
                              </tr>
                              <tr>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 text-center">{t('packagingInfo.singlePackage.weightPerCarton')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.singlePackage.weightKg} kg</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pallet Information */}
                      <div>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="relative group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                              <img 
                                src="/Content/boxes.png" 
                                alt={t('packagingInfo.pallet.label')} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 sm:mb-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-neutral-charcoal text-white text-[10px] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                              {t('packagingInfo.pallet.label')}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 sm:border-l-4 border-r-3 sm:border-r-4 border-t-3 sm:border-t-4 border-transparent border-t-neutral-charcoal"></div>
                            </div>
                          </div>
                          <h4 className="text-sm sm:text-base font-medium text-neutral-charcoal text-center">{t('packagingInfo.pallet.title')}</h4>
                        </div>
                        <div className="border border-neutral-stone/30 max-w-2xl mx-auto overflow-x-auto">
                          <table className="w-full text-xs sm:text-sm min-w-[280px]">
                            <tbody>
                              <tr className="border-b border-neutral-stone/30">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 w-1/2 text-center">{t('packagingInfo.pallet.cartonsPerPallet')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.pallet.boxes}</td>
                              </tr>
                              <tr className="border-b border-neutral-stone/30">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 text-center">{t('packagingInfo.pallet.squareMetersPerPallet')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.pallet.squareMeters} m²</td>
                              </tr>
                              <tr>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-slate font-medium bg-neutral-slate/5 text-center">{t('packagingInfo.pallet.totalPalletWeight')}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-neutral-charcoal font-medium text-center">{packagingInfo.pallet.totalWeightKg} kg</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-neutral-stone/30 pt-4 sm:pt-5 md:pt-6 lg:pt-8">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-charcoal mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center sm:text-left">{t('productModal.relatedProducts')}</h2>
                  <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-2 scroll-smooth hover:scroll-auto -webkit-overflow-scrolling-touch scrollbar-hide touch-pan-x" style={{ scrollbarWidth: 'thin' }}>
                    {relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-48 cursor-pointer group touch-manipulation"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            navigate(`/products?product=${relatedProduct.slug}&dimension=${relatedProduct.dimension}`);
                          }, 300);
                        }}
                      >
                        <div className="relative aspect-square bg-neutral-slate/10 overflow-hidden border border-neutral-stone/30 group-hover:border-neutral-charcoal transition-all duration-300 mb-1.5 sm:mb-2 md:mb-3 rounded-lg group-hover:shadow-md">
                          <img
                            src={getImageUrl(relatedProduct.image_url || '')}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-neutral-charcoal truncate group-hover:text-neutral-charcoal/80 transition-colors">
                            {relatedProduct.name}
                          </p>
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-slate mt-0.5 sm:mt-1">{relatedProduct.dimension} • {relatedProduct.surface}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Test Report Modal */}
          {product && (
            <TestReportModal
              dimension={product.dimension}
              isOpen={isTestReportOpen}
              onClose={() => setIsTestReportOpen(false)}
            />
          )}

          {/* Image Lightbox */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                onClick={() => setLightboxImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="relative max-w-7xl max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={getImageUrl(lightboxImage)}
                    alt="Full size"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;