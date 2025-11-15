import React, { useState, useMemo, useEffect, useCallback, useRef, useTransition, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from "@/components/Navigation";
const Footer = lazy(() => import("@/components/Footer"));
const ProductDetailModal = lazy(() => import("@/components/ProductDetailModal"));
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import { Filter, Grid, Search, X, ArrowUpDown } from 'lucide-react';
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
import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

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
  const productSlugParam = searchParams.get('product');

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
  const [slugHandled, setSlugHandled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const mutateSearchParams = useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams);
      mutator(next);
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

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
    const dimensionParam = searchParams.get('dimension');
    const bodyTypeParam = searchParams.get('bodyType');
    
    if (openFilter) {
      setIsSidebarOpen(true);
      // Scroll to filter section after a short delay
      setTimeout(() => {
        const filterSection = document.getElementById(`filter-${openFilter}`);
        if (filterSection) {
          filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Remove the query param after opening
          mutateSearchParams(params => params.delete('openFilter'));
        }
      }, 300);
    }
    
    // Handle dimension query parameter
    // Only apply if product param is not present (to avoid opening sidebar when clicking product)
    if (dimensionParam && !productSlugParam) {
      setFilters(prev => ({
        ...prev,
        dimensions: [dimensionParam]
      }));
      setIsSidebarOpen(true);
      // Remove the query param after applying filter
      setTimeout(() => {
        mutateSearchParams(params => params.delete('dimension'));
      }, 100);
    }
    
    // Handle bodyType query parameter
    // Only apply if product param is not present (to avoid opening sidebar when clicking product)
    if (bodyTypeParam && !productSlugParam) {
      setFilters(prev => ({
        ...prev,
        bodyTypes: [bodyTypeParam]
      }));
      setIsSidebarOpen(true);
      // Remove the query param after applying filter
      setTimeout(() => {
        mutateSearchParams(params => params.delete('bodyType'));
      }, 100);
    }
  }, [mutateSearchParams, searchParams, productSlugParam]);

  useEffect(() => {
    if (!productSlugParam) {
      if (slugHandled) {
        setSlugHandled(false);
      }
      return;
    }

    if (!allProducts.length || slugHandled) {
      return;
    }

    const matchedProduct = allProducts.find(product => product.slug === productSlugParam);
    if (!matchedProduct) {
      return;
    }

    setFilters(prev => {
      if (prev.dimensions.includes(matchedProduct.dimension)) {
        return prev;
      }
      return {
        ...prev,
        dimensions: [matchedProduct.dimension],
      };
    });

    setSelectedProduct(matchedProduct);
    setIsModalOpen(true);
    setSlugHandled(true);
  }, [allProducts, productSlugParam, slugHandled]);

  // Optimized scroll handler with requestAnimationFrame
  const scrollRAFRef = useRef<number>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRAFRef.current) {
        cancelAnimationFrame(scrollRAFRef.current);
      }

      scrollRAFRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const heroHeight = window.innerHeight * 0.6;
        
        if (currentScrollY < heroHeight) {
          setIsHeaderVisible(true);
        } else {
          if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 100) {
            setIsHeaderVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsHeaderVisible(true);
          }
        }
        
        setLastScrollY(currentScrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRAFRef.current) {
        cancelAnimationFrame(scrollRAFRef.current);
      }
    };
  }, [lastScrollY]);

  // Filter and sort products - optimized with useMemo
  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];

    const searchTermLower = filters.searchTerm.toLowerCase();
    const hasFilters = filters.dimensions.length > 0 || filters.surfaces.length > 0 || filters.bodyTypes.length > 0 || filters.searchTerm !== '';
    
    let filtered = hasFilters 
      ? allProducts.filter(product => {
          const matchesDimension = filters.dimensions.length === 0 || filters.dimensions.includes(product.dimension);
          const matchesSurface = filters.surfaces.length === 0 || filters.surfaces.includes(product.surface);
          const matchesBodyType = filters.bodyTypes.length === 0 || filters.bodyTypes.includes(product.body_type);
          const matchesSearch = filters.searchTerm === '' || 
            product.name.toLowerCase().includes(searchTermLower);

          return matchesDimension && matchesSurface && matchesBodyType && matchesSearch;
        })
      : allProducts;

    // Sort products only if needed
    if (sortBy !== 'date' || sortOrder !== 'desc') {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            const priceA = a.price || 0;
            const priceB = b.price || 0;
            comparison = priceA - priceB;
            break;
          case 'date':
          default:
            comparison = 0;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [allProducts, filters.dimensions, filters.surfaces, filters.bodyTypes, filters.searchTerm, sortBy, sortOrder]);


  // Debounced search term
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle filter changes with useTransition for better performance
  const handleFilterChange = useCallback((filterType: keyof FilterState, value: string) => {
    if (filterType === 'searchTerm') {
      setSearchTerm(value);
      return;
    }

    startTransition(() => {
      setFilters(prev => {
        const currentValues = prev[filterType] as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        
        return { ...prev, [filterType]: newValues };
      });
    });
  }, [startTransition]);

  // Clear all filters with transition
  const clearAllFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        dimensions: [],
        surfaces: [],
        bodyTypes: [],
        searchTerm: ''
      });
    });
  }, [startTransition]);

  // Extract product name for display - memoized
  const extractProductName = useCallback((fullName: string) => {
    return fullName.split(' ').slice(0, -2).join(' ') || fullName;
  }, []);

  // Handle product selection - memoized
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSlugHandled(true);
    mutateSearchParams(params => {
      params.set('product', product.slug);
      // Don't set dimension in URL when clicking product - it causes sidebar to auto-open
      // params.set('dimension', product.dimension);
    });
  }, [mutateSearchParams]);

  // Handle image change - memoized
  const handleImageChange = useCallback((productId: string, index: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: index
    }));
  }, []);

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    mutateSearchParams(params => params.delete('product'));
    setSlugHandled(false);
  };

  // Get related products (same dimension or surface)
  const getRelatedProducts = (currentProduct: Product) => {
    return allProducts.filter(product => 
      product.id !== currentProduct.id && 
      (product.dimension === currentProduct.dimension || 
       product.surface === currentProduct.surface)
    ).slice(0, 6);
  };

  // Pagination calculations - memoized
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentProducts };
  }, [filteredProducts, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentProducts } = paginationData;

  // Cleanup image indexes for products that are no longer visible
  useEffect(() => {
    const visibleProductIds = new Set(currentProducts.map(p => p.id));
    setCurrentImageIndexes(prev => {
      const cleaned: Record<string, number> = {};
      Object.keys(prev).forEach(id => {
        if (visibleProductIds.has(id)) {
          cleaned[id] = prev[id];
        }
      });
      return cleaned;
    });
  }, [currentProducts]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.dimensions, filters.surfaces, filters.bodyTypes, filters.searchTerm, sortBy, sortOrder]);

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
      <div className="relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[500px] xl:h-[600px] overflow-hidden">
        <img 
          src={`getImageUrl('/ALMAS/PORPJA.jpg')`}
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
          <div className="text-center text-white px-3 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6">{t('products.heroTitle')}</h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl opacity-90 max-w-2xl mx-auto px-2">{t('products.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-18 md:pb-20">{/* Reduced padding since hero is now larger */}
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-[56px] sm:top-[64px] md:top-[80px] left-2 sm:left-3 md:left-4 z-50 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg border border-stone-200 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-stone-700" />
          {(filters.dimensions.length > 0 || filters.surfaces.length > 0 || filters.bodyTypes.length > 0) && (
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-neutral-charcoal text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-semibold">
              {filters.dimensions.length + filters.surfaces.length + filters.bodyTypes.length}
            </span>
          )}
        </button>

        {/* Filters Sidebar */}
        <div className={`
          fixed lg:sticky top-14 sm:top-16 md:top-20 lg:top-24 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] w-[85vw] sm:w-72 max-w-[320px] lg:max-w-none bg-white/95 backdrop-blur-sm border-r border-stone-200 z-40 transform transition-transform duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent -webkit-overflow-scrolling-touch
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 pt-12 sm:pt-14 md:pt-16 lg:pt-4">
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-2 sm:top-2.5 md:top-3 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-stone-100 touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
            </button>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Search - Moved higher up */}
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-bold text-stone-800 mb-2 sm:mb-2.5 md:mb-3">{t('products.searchProducts')}</label>
                <div className="relative">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder={t('products.searchPlaceholder')}
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-9 sm:pl-10 md:pl-11 pr-8 sm:pr-9 md:pr-10 py-2 sm:py-2.5 md:py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-neutral-charcoal focus:border-transparent text-sm sm:text-base transition-all duration-200 touch-manipulation"
                    style={{ fontSize: '16px' }}
                  />
                  {filters.searchTerm && (
                    <button
                      onClick={() => handleFilterChange('searchTerm', '')}
                      className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors touch-manipulation"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dimensions Filter */}
              <div id="filter-dimension" className="scroll-mt-4">
                <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-700">{t('products.dimensions')}</h3>
                  {filters.dimensions.length > 0 && (
                    <span className="text-[10px] sm:text-xs bg-neutral-charcoal text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                      {filters.dimensions.length}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {filterOptions.dimensions.map(dimension => (
                    <label key={dimension} className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer group hover:bg-stone-50 p-1.5 sm:p-2 rounded transition-colors touch-manipulation">
                      <input
                        type="checkbox"
                        checked={filters.dimensions.includes(dimension)}
                        onChange={() => handleFilterChange('dimensions', dimension)}
                        className="rounded border-stone-300 text-neutral-charcoal focus:ring-neutral-charcoal transition-all w-4 h-4 sm:w-4.5 sm:h-4.5"
                      />
                      <span className="text-xs sm:text-sm text-stone-600 group-hover:text-stone-800 transition-colors">{dimension}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Surface Filter */}
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-700">{t('products.filterBySurface')}</h3>
                  {filters.surfaces.length > 0 && (
                    <span className="text-[10px] sm:text-xs bg-neutral-charcoal text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                      {filters.surfaces.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {filterOptions.surfaces.map(surface => (
                    <label key={surface} className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer group hover:bg-stone-50 p-1.5 sm:p-2 rounded transition-colors touch-manipulation">
                      <input
                        type="checkbox"
                        checked={filters.surfaces.includes(surface)}
                        onChange={() => handleFilterChange('surfaces', surface)}
                        className="rounded border-stone-300 text-neutral-charcoal focus:ring-neutral-charcoal transition-all w-4 h-4 sm:w-4.5 sm:h-4.5"
                      />
                      <span className="text-xs sm:text-sm text-stone-600 group-hover:text-stone-800 transition-colors">{surface}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Body Type Filter */}
              <div id="filter-material" className="scroll-mt-4">
                <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-700">{t('products.material')}</h3>
                  {filters.bodyTypes.length > 0 && (
                    <span className="text-[10px] sm:text-xs bg-neutral-charcoal text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                      {filters.bodyTypes.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {filterOptions.bodyTypes.map(bodyType => (
                    <label key={bodyType} className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer group hover:bg-stone-50 p-1.5 sm:p-2 rounded transition-colors touch-manipulation">
                      <input
                        type="checkbox"
                        checked={filters.bodyTypes.includes(bodyType)}
                        onChange={() => handleFilterChange('bodyTypes', bodyType)}
                        className="rounded border-stone-300 text-neutral-charcoal focus:ring-neutral-charcoal transition-all w-4 h-4 sm:w-4.5 sm:h-4.5"
                      />
                      <span className="text-xs sm:text-sm text-stone-600 group-hover:text-stone-800 transition-colors">{bodyType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                disabled={isPending}
                className="w-full py-2 sm:py-2.5 md:py-2 px-3 sm:px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
              >
                {isPending ? '...' : t('products.clearFilters')}
              </button>

              {/* Results Count */}
              <div className="text-xs sm:text-sm text-stone-500 text-center">
                {filteredProducts.length} {t('products.productsFound')}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
          <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 md:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-stone-800">{t('products.title')}</h2>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                    setCurrentPage(1);
                  }}
                  className="appearance-none w-full sm:w-auto pl-8 sm:pl-10 pr-7 sm:pr-8 py-1.5 sm:py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-neutral-charcoal focus:border-transparent text-xs sm:text-sm text-stone-700 bg-white cursor-pointer transition-all touch-manipulation"
                  style={{ fontSize: '16px' }}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
                <ArrowUpDown className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 pointer-events-none" />
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-stone-600">
                <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{filteredProducts.length} {t('products.items')}</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <ProductLoadingSkeleton />
          ) : (
            <>
              {/* Products Grid - 4 items per row max */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-start">
                {currentProducts.map((product, index) => {
                  const currentImageIndex = currentImageIndexes[product.id] || 0;
                  const priority = index < 8; // Preload first 8 images for LCP
                  
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currentImageIndex={currentImageIndex}
                      onImageChange={handleImageChange}
                      onClick={handleProductClick}
                      extractProductName={extractProductName}
                      priority={priority}
                    />
                  );
                })}
              </div>
              
              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                }}
              />
              
              {/* Page Info */}
              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-stone-600 px-2">
                {t('products.showing')} {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} {t('products.of')} {filteredProducts.length} {t('products.products')}
              </div>
            </>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 bg-stone-200 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-stone-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-stone-700 mb-1.5 sm:mb-2">{t('products.noProducts')}</h3>
              <p className="text-sm sm:text-base text-stone-500 mb-3 sm:mb-4">{t('products.tryAdjustingFilters')}</p>
              <button
                onClick={clearAllFilters}
                className="py-2 sm:py-2.5 px-5 sm:px-6 bg-neutral-charcoal hover:bg-neutral-charcoal/90 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base touch-manipulation"
              >
                {t('products.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer - Lazy Loaded */}
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Product Detail Modal - Lazy Loaded */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            relatedProducts={selectedProduct ? getRelatedProducts(selectedProduct) : []}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Products;