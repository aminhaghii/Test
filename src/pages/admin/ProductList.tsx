import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { productService, ProductFilter, Product } from '@/services/productServiceBackend';
import { 
  Plus, Search, Filter, Edit2, Trash2, Eye, 
  MoreVertical, Check, X, ChevronLeft, ChevronRight, Home, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/BrandLogo';

const ProductList = () => {
  // Temporarily disable auth
  const isAdmin = true;
  const authLoading = false;
  // const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const [filters, setFilters] = useState<ProductFilter>({
    dimensions: [],
    surfaces: [],
    bodyTypes: [],
    categories: [],
    searchTerm: '',
    isActive: undefined
  });

  const [filterOptions, setFilterOptions] = useState({
    dimensions: [] as string[],
    surfaces: [] as string[],
    bodyTypes: [] as string[],
    categories: [] as string[]
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await productService.getProducts(filters, {
        page: currentPage,
        pageSize
      });
      
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadFilterOptions();
    }
  }, [isAdmin, loadProducts]);

  const loadFilterOptions = async () => {
    try {
      const options = await productService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, searchTerm: term }));
    setCurrentPage(1);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await productService.bulkDeleteProducts(selectedProducts);
      toast.success('Products deleted successfully');
      setSelectedProducts([]);
      loadProducts();
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productService.updateProduct(product.id, {
        is_active: !product.is_active
      });
      toast.success(`Product ${product.is_active ? 'deactivated' : 'activated'}`);
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await productService.updateProduct(product.id, {
        is_featured: !product.is_featured
      });
      toast.success(`Product ${product.is_featured ? 'unfeatured' : 'featured'}`);
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-20">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-8">
              <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" />
                <BrandLogo className="h-5 sm:h-6 md:h-7 w-auto" eager />
              </Link>
              
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <Link to="/admin" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-xs sm:text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Products
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="text-neutral-graphite text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Exit Admin</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-20 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal mb-1 sm:mb-2">
              Products Management
            </h1>
            <p className="text-neutral-slate text-sm sm:text-base">
              {total} total products
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/admin/products/new')}
            className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm md:text-base touch-manipulation w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card border border-neutral-stone/20 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 sm:pl-11 h-10 sm:h-11 md:h-12 text-sm sm:text-base touch-manipulation"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Filter Button */}
            <Button
              onClick={() => setFilterOpen(!filterOpen)}
              variant="outline"
              className="border-2 h-10 sm:h-11 md:h-12 px-4 sm:px-5 md:px-6 text-xs sm:text-sm touch-manipulation"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Filters
            </Button>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                className="h-10 sm:h-11 md:h-12 px-4 sm:px-5 md:px-6 text-xs sm:text-sm touch-manipulation"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Delete ({selectedProducts.length})
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-neutral-stone/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Dimensions
                  </label>
                  <div className="space-y-2">
                    {filterOptions.dimensions.map(dim => (
                      <label key={dim} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.dimensions?.includes(dim)}
                          onChange={() => {
                            setFilters(prev => ({
                              ...prev,
                              dimensions: prev.dimensions?.includes(dim)
                                ? prev.dimensions.filter(d => d !== dim)
                                : [...(prev.dimensions || []), dim]
                            }));
                            setCurrentPage(1);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{dim}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Surfaces */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Surfaces
                  </label>
                  <div className="space-y-2">
                    {filterOptions.surfaces.map(surface => (
                      <label key={surface} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.surfaces?.includes(surface)}
                          onChange={() => {
                            setFilters(prev => ({
                              ...prev,
                              surfaces: prev.surfaces?.includes(surface)
                                ? prev.surfaces.filter(s => s !== surface)
                                : [...(prev.surfaces || []), surface]
                            }));
                            setCurrentPage(1);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{surface}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Body Types */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Body Types
                  </label>
                  <div className="space-y-2">
                    {filterOptions.bodyTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.bodyTypes?.includes(type)}
                          onChange={() => {
                            setFilters(prev => ({
                              ...prev,
                              bodyTypes: prev.bodyTypes?.includes(type)
                                ? prev.bodyTypes.filter(t => t !== type)
                                : [...(prev.bodyTypes || []), type]
                            }));
                            setCurrentPage(1);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.isActive === undefined}
                        onChange={() => {
                          setFilters(prev => ({ ...prev, isActive: undefined }));
                          setCurrentPage(1);
                        }}
                      />
                      <span className="text-sm">All</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.isActive === true}
                        onChange={() => {
                          setFilters(prev => ({ ...prev, isActive: true }));
                          setCurrentPage(1);
                        }}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.isActive === false}
                        onChange={() => {
                          setFilters(prev => ({ ...prev, isActive: false }));
                          setCurrentPage(1);
                        }}
                      />
                      <span className="text-sm">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    setFilters({
                      dimensions: [],
                      surfaces: [],
                      bodyTypes: [],
                      categories: [],
                      searchTerm: '',
                      isActive: undefined
                    });
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-card border border-neutral-stone/20 overflow-hidden">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full min-w-[800px]">
              <thead className="bg-neutral-alabaster border-b border-neutral-stone/20">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      className="rounded w-4 h-4 touch-manipulation"
                    />
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">
                    Image
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">
                    Name
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal hidden md:table-cell">
                    Dimension
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal hidden lg:table-cell">
                    Surface
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-neutral-slate">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-stone/10 hover:bg-neutral-alabaster/50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded w-4 h-4 touch-manipulation"
                        />
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-lg"
                          />
                        )}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="font-medium text-neutral-charcoal text-xs sm:text-sm md:text-base">{product.name}</div>
                        {product.is_featured && (
                          <span className="inline-block px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-luxury-gold/20 text-luxury-gold rounded-full mt-1">
                            Featured
                          </span>
                        )}
                        <div className="md:hidden text-xs text-neutral-slate mt-1">
                          {product.dimension} • {product.surface}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-neutral-slate hidden md:table-cell">
                        {product.dimension}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-neutral-slate hidden lg:table-cell">
                        {product.surface}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-neutral-slate hidden lg:table-cell">
                        {product.category || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium touch-manipulation ${
                            product.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Button
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 touch-manipulation"
                          >
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 touch-manipulation"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-neutral-stone/20 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-neutral-slate text-center sm:text-left">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, total)} of {total} products
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                
                <span className="text-xs sm:text-sm text-neutral-slate px-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
