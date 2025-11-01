import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  Package, 
  Sparkles, 
  Ruler, 
  Eye, 
  Info,
  Layers,
  Box,
  Palette,
  Shield,
  Truck,
  CheckCircle2,
  FileText,
  Grid3x3,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '@/services/productServiceBackend';
import TestReportModal from './TestReportModal';
import { FileCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  const [expandedPackaging, setExpandedPackaging] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isTestReportOpen, setIsTestReportOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    if (product) {
      setExpandedFeatures(false);
      setExpandedPackaging(false);
      setExpandedSpecs(false);
      setSelectedImage(product.image_url || '');
    }
  }, [product]);

  // Memoize expensive computations - MUST be before any conditional returns
  const { environmentImage, textureImages, additionalImages, allImages } = useMemo(() => {
    if (!product) {
      return {
        environmentImage: '',
        textureImages: [],
        additionalImages: [],
        allImages: []
      };
    }
    
    const selectedImg = selectedImage || product.image_url || '';
    const textures = product.texture_images || [];
    const additional = product.additional_images || [];
    const all = [product.image_url, ...additional].filter(Boolean);
    
    return {
      environmentImage: selectedImg,
      textureImages: textures,
      additionalImages: additional,
      allImages: all
    };
  }, [product, selectedImage]);

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
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-luxury-gold rounded-lg flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{t('productModal.title')}</h1>
                    <p className="text-sm text-gray-500">{t('productModal.subtitle')}</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Side - Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div 
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setLightboxImage(environmentImage)}
                  >
                    <img
                      src={getImageUrl(environmentImage)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="eager"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-luxury-gold text-white rounded text-sm font-medium">
                        <Eye className="w-3 h-3" />
                        {t('productModal.preview')}
                      </span>
                    </div>
                    
                    {product.stock_quantity > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('productModal.inStock')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {allImages.slice(0, 5).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img || '')}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === img 
                              ? 'border-luxury-gold' 
                              : 'border-gray-200 hover:border-luxury-gold/50'
                          }`}
                        >
                          <img
                            src={getImageUrl(img || '')}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Product Info */}
                <div className="space-y-4">
                  {/* Product Title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {product.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded text-sm font-medium">
                          <Box className="w-3 h-3" />
                          {product.category}
                        </span>
                      )}
                      {product.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm font-medium">
                          <Sparkles className="w-3 h-3" />
                          {t('productModal.featured')}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-gray-500">{t('productModal.sku')}: {product.slug}</p>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ruler className="w-4 h-4 text-luxury-gold" />
                        <span className="text-sm font-medium text-gray-600">{t('productModal.dimension')}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{product.dimension}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">{t('productModal.surface')}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{product.surface}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-600">{t('productModal.material')}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{product.body_type}</p>
                    </div>

                    {product.color && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Palette className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-600">{t('productModal.color')}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{product.color}</p>
                      </div>
                    )}

                    {/* Thickness and Absorption Rate */}
                    {(product as any).thickness && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-gray-600">{t('productModal.thickness')}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{(product as any).thickness}mm</p>
                      </div>
                    )}

                    {(product as any).absorption_rate && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-medium text-gray-600">{t('productModal.absorption')}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{(product as any).absorption_rate}%</p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {product.price && (
                    <div className="bg-luxury-gold/10 rounded-lg p-4 border border-luxury-gold/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-luxury-gold" />
                        <span className="text-sm font-semibold text-gray-600">{t('productModal.price')}</span>
                      </div>
                      <p className="text-3xl font-bold text-luxury-gold">${product.price}</p>
                      <p className="text-sm text-gray-500">{t('productModal.perSquareMeter')}</p>
                    </div>
                  )}

                  {/* Test Report Button */}
                  <button
                    onClick={() => setIsTestReportOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{t('productModal.testReport')}</span>
                  </button>

                  {/* Description */}
                  {product.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-luxury-gold" />
                        <h3 className="text-lg font-bold text-gray-900">{t('productModal.description')}</h3>
                      </div>
                      <p className="text-gray-700">{product.description}</p>
                    </div>
                  )}

                  {/* Expandable Sections */}
                  <div className="space-y-2">
                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFeatures(!expandedFeatures)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-luxury-gold" />
                            <span className="font-semibold text-gray-900">{t('productModal.keyFeatures')}</span>
                            <span className="text-xs text-gray-500">({product.features.length})</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedFeatures ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFeatures && (
                          <div className="px-4 pb-4 space-y-2">
                            {product.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Technical Specifications */}
                    {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedSpecs(!expandedSpecs)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Grid3x3 className="w-4 h-4 text-luxury-gold" />
                            <span className="font-semibold text-gray-900">{t('productModal.technicalSpecs')}</span>
                            <span className="text-xs text-gray-500">({Object.keys(product.technical_specs).length})</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSpecs ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedSpecs && (
                          <div className="px-4 pb-4 space-y-2">
                            {Object.entries(product.technical_specs).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="font-medium text-gray-900">{formatSpecValue(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Packaging */}
                    {product.packaging && product.packaging.length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedPackaging(!expandedPackaging)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-luxury-gold" />
                            <span className="font-semibold text-gray-900">{t('productModal.packagingInfo')}</span>
                            <span className="text-xs text-gray-500">({product.packaging.length})</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedPackaging ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedPackaging && (
                          <div className="px-4 pb-4 space-y-2">
                            {product.packaging.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                <Truck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Texture Images Section */}
              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-luxury-gold" />
                    <h2 className="text-xl font-bold text-gray-900">{t('productModal.textureGallery')}</h2>
                  </div>
                  
                  {textureImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {textureImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square bg-white rounded-lg overflow-hidden border hover:border-luxury-gold transition-all cursor-pointer group"
                          onClick={() => setLightboxImage(image)}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`${t('productModal.application')} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {t('productModal.view')} {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {t('productModal.noTextureImages')}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {t('productModal.noTextureImagesDesc')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-luxury-gold" />
                      <h2 className="text-xl font-bold text-gray-900">{t('productModal.relatedProducts')}</h2>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {relatedProducts.map((relatedProduct) => (
                        <div
                          key={relatedProduct.id}
                          className="flex-shrink-0 w-48 cursor-pointer group"
                        >
                          <div className="relative aspect-square bg-white rounded-lg overflow-hidden border group-hover:border-luxury-gold transition-colors">
                            <img
                              src={getImageUrl(relatedProduct.image_url || '')}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-luxury-gold transition-colors">
                              {relatedProduct.name}
                            </p>
                            <p className="text-xs text-gray-500">{relatedProduct.dimension} • {relatedProduct.surface}</p>
                            {relatedProduct.price && (
                              <p className="text-sm font-bold text-luxury-gold mt-1">${relatedProduct.price}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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