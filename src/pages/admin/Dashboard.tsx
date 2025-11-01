import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';
import { productService } from '@/services/productServiceBackend';
import { Package, Users, TrendingUp, DollarSign, Plus, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-luxury-gold" />
                <span className="font-display font-bold text-xl text-neutral-charcoal">
                  Almas<span className="text-luxury-gold">Ceram</span>
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/admin" className="text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Products
                </Link>
                <Link to="/admin/users" className="text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Users
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-slate hidden md:block">
                {user?.name || 'Admin'}
              </span>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="text-neutral-graphite"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 lg:px-20 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-4xl font-bold text-neutral-charcoal mb-2">
                Admin Dashboard
              </h1>
              <p className="text-neutral-slate text-lg">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/admin/products/new')}
              className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-neutral-slate text-sm mb-1">{stat.title}</p>
                <p className="font-display text-4xl font-bold text-neutral-charcoal">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20 mb-12">
          <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/admin/products')}
              variant="outline"
              className="justify-start h-auto py-4 px-6 border-2 hover:border-luxury-gold"
            >
              <Package className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Manage Products</div>
                <div className="text-sm text-neutral-slate">View and edit all products</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/admin/products/new')}
              variant="outline"
              className="justify-start h-auto py-4 px-6 border-2 hover:border-luxury-gold"
            >
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Add Product</div>
                <div className="text-sm text-neutral-slate">Create new product</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="justify-start h-auto py-4 px-6 border-2 hover:border-luxury-gold"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">User Management</div>
                <div className="text-sm text-neutral-slate">View and manage users</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
          <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
            Recent Activity
          </h2>
          <p className="text-neutral-slate">
            Activity tracking will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
