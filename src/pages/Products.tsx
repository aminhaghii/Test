import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Filter, Grid, Search, X } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productService, Product } from '@/services/productServiceBackend';
import { useLanguage } from "@/contexts/LanguageContext";

// Filter state interface
interface FilterState {
  dimensions: string[];
  surfaces: string[];
  bodyTypes: string[];
  searchTerm: string;
}

// Available filter options based on ALMAS folder analysis (real products)
const filterOptions = {
  dimensions: ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'],
  surfaces: ['Matt', 'Trans', 'Polished'],
  bodyTypes: ['White Body', 'Porcelain']
};

// API URL for backend resources
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Products = () => {
  const { t } = useLanguage();
  
  // Helper function to get image URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };
  // Get dimension from URL params
  const { dimension } = useParams<{ dimension?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state - initialize with dimension from URL if present
  const [filters, setFilters] = useState<FilterState>({
    dimensions: dimension ? [dimension] : [],
    surfaces: [],
    bodyTypes: [],
    searchTerm: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Use React Query for data fetching with caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const response = await productService.getProducts({ isActive: true }, { page: 1, pageSize: 500 });
      return response.products;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2
  });

  const allProducts = data || [];

  // Update filters when dimension parameter changes
  useEffect(() => {
    if (dimension) {
      setFilters(prev => ({
        ...prev,
        dimensions: [dimension]
      }));
    }
  }, [dimension]);

  // Open sidebar and scroll to filter section when openFilter query param is present
  useEffect(() => {
    const openFilter = searchParams.get('openFilter');
    if (openFilter) {
      setIsSidebarOpen(true);
      // Scroll to filter section after a short delay
      setTimeout(() => {
        const filterSection = document.getElementById(`filter-${openFilter}`);
        if (filterSection) {
          filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Remove the query param after opening
          setSearchParams({});
        }
      }, 500);
    }
  }, [searchParams, setSearchParams]);

  // Auto-hide header functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.6; // Approximate hero section height
      
      if (currentScrollY < heroHeight) {
        // Always show header when in hero section
        setIsHeaderVisible(true);
      } else {
        // Auto-hide logic when in products section
        if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 100) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show header
          setIsHeaderVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Filter products from backend
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesDimension = filters.dimensions.length === 0 || filters.dimensions.includes(product.dimension);
      const matchesSurface = filters.surfaces.length === 0 || filters.surfaces.includes(product.surface);
      const matchesBodyType = filters.bodyTypes.length === 0 || filters.bodyTypes.includes(product.body_type);
      const matchesSearch = filters.searchTerm === '' || 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesDimension && matchesSurface && matchesBodyType && matchesSearch;
    });
  }, [allProducts, filters]);


  // Debounced search term
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    if (filterType === 'searchTerm') {
      setSearchTerm(value);
      return;
    }

    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      dimensions: [],
      surfaces: [],
      bodyTypes: [],
      searchTerm: ''
    });
  };

  // Extract product name for display
  const extractProductName = (fullName: string) => {
    return fullName.split(' ').slice(0, -2).join(' ') || fullName;
  };

  // Handle product selection
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Get related products (same dimension or surface)
  const getRelatedProducts = (currentProduct: Product) => {
    return allProducts.filter(product => 
      product.id !== currentProduct.id && 
      (product.dimension === currentProduct.dimension || 
       product.surface === currentProduct.surface)
    ).slice(0, 6);
  };

  // Pagination calculations (after filteredProducts is computed)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.dimensions, filters.surfaces, filters.bodyTypes, filters.searchTerm]);

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg">{t('products.loadError')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Navigation - Same as all other pages */}
      <Navigation />
      
      {/* Large Hero Image */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
        <img 
          src={`${API_URL}/ALMAS/PORPJA.jpg`}
          alt="Premium Ceramics Collection"
          className="w-full h-full object-cover scale-105"
          width={1920}
          height={600}
          loading="eager"
          // React types don't include lowercase fetchpriority; set via ref to avoid warning and typing errors
          ref={(el) => { if (el) el.setAttribute('fetchpriority', 'high'); }}
          decoding="sync"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1280px, 1920px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">{t('products.heroTitle')}</h1>
            <p className="text-xl md:text-2xl lg:text-3xl opacity-90 max-w-2xl mx-auto">{t('products.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* Products Menu Bar - Center of page */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-stone-200 shadow-sm">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => {
                clearAllFilters();
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filters.dimensions.length === 0 && filters.surfaces.length === 0 && filters.bodyTypes.length === 0
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t('nav.allProducts') || 'All Products'}
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setTimeout(() => {
                  const filterSection = document.getElementById('filter-dimension');
                  if (filterSection) {
                    filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filters.dimensions.length > 0
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t('products.byDimension') || 'By Dimension'}
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setTimeout(() => {
                  const filterSection = document.getElementById('filter-material');
                  if (filterSection) {
                    filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filters.bodyTypes.length > 0
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t('products.byMaterial') || 'By Material'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile quick filters (chips) */}
      <div className="lg:hidden sticky top-[calc(4rem+73px)] z-30 bg-white/95 backdrop-blur-md border-y border-stone-200">
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            {filterOptions.dimensions.map(d => (
              <button
                key={d}
                onClick={() => handleFilterChange('dimensions', d)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  filters.dimensions.includes(d)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            {filterOptions.surfaces.map(s => (
              <button
                key={s}
                onClick={() => handleFilterChange('surfaces', s)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  filters.surfaces.includes(s)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-screen pt-8 pb-20">{/* Reduced padding since hero is now larger */}
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-stone-200"
        >
          <Filter className="w-5 h-5 text-stone-700" />
        </button>

        {/* Filters Sidebar */}
        <div className={`
          fixed lg:sticky top-24 left-0 h-[calc(100vh-6rem)] w-72 bg-white/95 backdrop-blur-sm border-r border-stone-200 z-40 transform transition-transform duration-300 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 pt-16 lg:pt-4">
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-2 right-4 p-2 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Search - Moved higher up */}
              <div>
                <label className="block text-lg font-bold text-stone-800 mb-3">{t('products.searchProducts')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder={t('products.searchPlaceholder')}
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-champagne-gold focus:border-transparent text-base"
                  />
                </div>
              </div>

              {/* Dimensions Filter */}
              <div id="filter-dimension" className="scroll-mt-4">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">{t('products.dimensions')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.dimensions.map(dimension => (
                    <label key={dimension} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.dimensions.includes(dimension)}
                        onChange={() => handleFilterChange('dimensions', dimension)}
                        className="rounded border-stone-300 text-champagne-gold focus:ring-champagne-gold"
                      />
                      <span className="text-sm text-stone-600">{dimension}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Surface Filter */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">{t('products.filterBySurface')}</h3>
                <div className="space-y-2">
                  {filterOptions.surfaces.map(surface => (
                    <label key={surface} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.surfaces.includes(surface)}
                        onChange={() => handleFilterChange('surfaces', surface)}
                        className="rounded border-stone-300 text-champagne-gold focus:ring-champagne-gold"
                      />
                      <span className="text-sm text-stone-600">{surface}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Body Type Filter */}
              <div id="filter-material" className="scroll-mt-4">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">{t('products.material')}</h3>
                <div className="space-y-2">
                  {filterOptions.bodyTypes.map(bodyType => (
                    <label key={bodyType} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.bodyTypes.includes(bodyType)}
                        onChange={() => handleFilterChange('bodyTypes', bodyType)}
                        className="rounded border-stone-300 text-champagne-gold focus:ring-champagne-gold"
                      />
                      <span className="text-sm text-stone-600">{bodyType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors duration-200"
              >
                {t('products.clearFilters')}
              </button>

              {/* Results Count */}
              <div className="text-sm text-stone-500 text-center">
                {filteredProducts.length} {t('products.productsFound')}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-8 lg:p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-stone-800">{t('products.title')}</h2>
            <div className="flex items-center space-x-2 text-sm text-stone-600">
              <Grid className="w-4 h-4" />
              <span>{filteredProducts.length} {t('products.items')}</span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[420px] rounded-[15px] bg-stone-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Products Grid - 4 items per row max */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
                {currentProducts.map((product, index) => {
                  // Prepare image URLs (no hooks inside map)
                  const imageUrl = product.image_url 
                    ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
                    : `https://via.placeholder.com/400x400/f5f5f0/8B7355?text=${encodeURIComponent(product.name)}`;
                  
                  const additionalImages = product.additional_images?.map(img => 
                    img.startsWith('http') ? img : `${API_URL}${img}`
                  ) || [];
                  
                  const textureImages = product.texture_images?.map(img => 
                    img.startsWith('http') ? img : `${API_URL}${img}`
                  ) || [];
                  
                  const currentImageIndex = currentImageIndexes[product.id] || 0;
                  const allImages = [imageUrl, ...additionalImages, ...textureImages].filter(Boolean);
                  
                  const handleImageChange = (idx: number) => {
                    setCurrentImageIndexes(prev => ({
                      ...prev,
                      [product.id]: idx
                    }));
                  };
                  
                  return (
                    <div 
                      key={product.id} 
                      className="flex justify-center"
                    >
                      <div 
                        className="relative w-full cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Simple Card - no hover animation */}
                        <div className="relative h-[420px] overflow-hidden rounded-[15px] bg-stone-200" style={{ contentVisibility: 'auto', containIntrinsicSize: '420px 300px' }}>
                          <img
                            src={allImages[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width={400}
                            height={400}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          
                          {/* Overlay Content */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                            <div className="overflow-hidden">
                              <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{extractProductName(product.name)}</h3>
                              <p className="text-white/80 text-sm mb-2">{product.dimension} • {product.surface}</p>
                              {product.price && (
                                <p className="text-luxury-gold font-bold text-lg mb-2">${product.price}</p>
                              )}
                              {product.is_featured && (
                                <span className="inline-block bg-luxury-gold text-white text-xs px-2 py-1 rounded-full mb-2">{t('products.featured')}</span>
                              )}
                            </div>
                            <button 
                              className="bg-champagne-gold hover:bg-champagne-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                              }}
                            >
                              {t('products.viewDetails')}
                            </button>
                          </div>
                        </div>
                        
                        {/* Image Gallery Dots - only show if there are additional images */}
                        {allImages.length > 1 && (
                          <div className="absolute top-2 right-2 flex gap-1.5 z-20">
                            {allImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageChange(idx);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                  idx === currentImageIndex 
                                    ? 'bg-luxury-gold w-6' 
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`View image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Environment Badge - shown when viewing DECORED images */}
                        {currentImageIndex > 0 && (
                          <div className="absolute top-2 left-2 z-20">
                            <span className="bg-luxury-gold/90 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                              {t('products.environmentView')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('products.previous')}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg border ${
                          currentPage === page
                            ? 'bg-luxury-gold text-white border-luxury-gold'
                            : 'border-stone-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('products.next')}
                  </button>
                </div>
              )}
              
              {/* Page Info */}
              <div className="mt-4 text-center text-sm text-stone-600">
                {t('products.showing')} {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} {t('products.of')} {filteredProducts.length} {t('products.products')}
              </div>
            </>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-700 mb-2">{t('products.noProducts')}</h3>
              <p className="text-stone-500 mb-4">{t('products.tryAdjustingFilters')}</p>
              <button
                onClick={clearAllFilters}
                className="py-2 px-6 bg-champagne-gold hover:bg-champagne-gold/90 text-white rounded-lg transition-colors duration-200"
              >
                {t('products.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <Footer />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        relatedProducts={selectedProduct ? getRelatedProducts(selectedProduct) : []}
      />
    </div>
  );
};

export default Products;