import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';
import { productService } from '@/services/productServiceBackend';
import { Package, Users, TrendingUp, DollarSign, Plus, Home, LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  totalCategories: number;
}

const Dashboard = () => {
  const { isAdmin, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Get all products
      const { total } = await productService.getProducts({});
      
      // Get active products
      const { total: activeTotal } = await productService.getProducts({ isActive: true });
      
      // Get featured products
      const { total: featuredTotal } = await productService.getProducts({ isFeatured: true });
      
      // Get filter options to count categories
      const filterOptions = await productService.getFilterOptions();

      setStats({
        totalProducts: total,
        activeProducts: activeTotal,
        featuredProducts: featuredTotal,
        totalCategories: filterOptions.categories.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-slate">Loading...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Featured Products',
      value: stats.featuredProducts,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

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
                <Link to="/admin" className="text-xs sm:text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Products
                </Link>
                <Link to="/admin/blog" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Blog
                </Link>
                <Link to="/admin/users" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Users
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <span className="text-xs sm:text-sm text-neutral-slate hidden md:block">
                {user?.name || 'Admin'}
              </span>
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
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal mb-1 sm:mb-2">
                Admin Dashboard
              </h1>
              <p className="text-neutral-slate text-sm sm:text-base md:text-lg">
                Welcome back, {user?.name || 'Admin'}
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20 touch-manipulation"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-neutral-slate text-xs sm:text-sm mb-1">{stat.title}</p>
                <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-card border border-neutral-stone/20 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-charcoal mb-4 sm:mb-5 md:mb-6">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/admin/products')}
              variant="outline"
              className="justify-start h-auto py-3 sm:py-4 px-4 sm:px-5 md:px-6 border-2 hover:border-luxury-gold touch-manipulation"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-semibold text-sm sm:text-base">Manage Products</div>
                <div className="text-xs sm:text-sm text-neutral-slate">View and edit all products</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/admin/products/new')}
              variant="outline"
              className="justify-start h-auto py-3 sm:py-4 px-4 sm:px-5 md:px-6 border-2 hover:border-luxury-gold touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-semibold text-sm sm:text-base">Add Product</div>
                <div className="text-xs sm:text-sm text-neutral-slate">Create new product</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/admin/blog')}
              variant="outline"
              className="justify-start h-auto py-3 sm:py-4 px-4 sm:px-5 md:px-6 border-2 hover:border-luxury-gold touch-manipulation"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-semibold text-sm sm:text-base">Blog Management</div>
                <div className="text-xs sm:text-sm text-neutral-slate">Manage blog posts and articles</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="justify-start h-auto py-3 sm:py-4 px-4 sm:px-5 md:px-6 border-2 hover:border-luxury-gold touch-manipulation"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-semibold text-sm sm:text-base">User Management</div>
                <div className="text-xs sm:text-sm text-neutral-slate">View and manage users</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-card border border-neutral-stone/20">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-charcoal mb-4 sm:mb-5 md:mb-6">
            Recent Activity
          </h2>
          <p className="text-neutral-slate text-sm sm:text-base">
            Activity tracking will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
