import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Home,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService, User as UserType } from '@/services/authService';
import { useAuth } from '@/contexts/BackendAuthContext';
import BrandLogo from '@/components/BrandLogo';

interface AdminUserDashboardProps {
  onUserSelect?: (user: UserType) => void;
}

const UserManagement: React.FC<AdminUserDashboardProps> = ({ onUserSelect }) => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [filters, setFilters] = useState({
    search: '',
    user_type: '',
    industry: '',
    min_completion: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    personal: 0,
    company: 0,
    avgCompletion: 0
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [currentPage, filters, isAdmin]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getAllUsers({
        page: currentPage,
        limit: 20,
        ...filters
      });
      
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setTotalUsers(response.pagination.total);
      
      // Calculate stats
      const personalCount = response.users.filter(u => u.user_type === 'personal').length;
      const companyCount = response.users.filter(u => u.user_type === 'company').length;
      const avgCompletion = response.users.reduce((sum, u) => sum + u.profile_completion_percentage, 0) / response.users.length;
      
      setStats({
        total: response.pagination.total,
        personal: personalCount,
        company: companyCount,
        avgCompletion: Math.round(avgCompletion)
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user);
    onUserSelect?.(user);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const industries = [
    'Construction', 'Interior Design', 'Architecture', 'Retail', 
    'Real Estate', 'Contractor', 'Other'
  ];

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
                <Link to="/admin/products" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Products
                </Link>
                <Link to="/admin/users" className="text-xs sm:text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Users
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <span className="text-xs sm:text-sm text-neutral-slate hidden md:block">
                Admin
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-5 md:mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal mb-1 sm:mb-2">
                User Management
              </h1>
              <p className="text-neutral-slate text-sm sm:text-base md:text-lg">
                Manage and monitor registered users
              </p>
            </div>
            
            <Button
              className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm md:text-base touch-manipulation w-full sm:w-auto"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20 touch-manipulation">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-neutral-slate text-xs sm:text-sm mb-1">Total Users</p>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                {isLoading ? '...' : stats.total}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20 touch-manipulation">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-neutral-slate text-xs sm:text-sm mb-1">Personal Users</p>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                {isLoading ? '...' : stats.personal}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20 touch-manipulation">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-neutral-slate text-xs sm:text-sm mb-1">Companies</p>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                {isLoading ? '...' : stats.company}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-stone/20 touch-manipulation">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-bronze flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-neutral-slate text-xs sm:text-sm mb-1">Avg Completion</p>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                {isLoading ? '...' : `${stats.avgCompletion}%`}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card border border-neutral-stone/20 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="font-display text-lg sm:text-xl font-bold text-neutral-charcoal mb-3 sm:mb-4">Filter Users</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-slate" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-neutral-stone rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-white text-sm sm:text-base touch-manipulation"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[140px] md:min-w-48">
              <select
                value={filters.user_type}
                onChange={(e) => handleFilterChange('user_type', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 border border-neutral-stone rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-white text-sm sm:text-base touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                <option value="">All Types</option>
                <option value="personal">Personal</option>
                <option value="company">Company</option>
              </select>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[140px] md:min-w-48">
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 border border-neutral-stone rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-white text-sm sm:text-base touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[140px] md:min-w-48">
              <select
                value={filters.min_completion}
                onChange={(e) => handleFilterChange('min_completion', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 border border-neutral-stone rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-white text-sm sm:text-base touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                <option value="">All Completion</option>
                <option value="80">80%+ Complete</option>
                <option value="60">60%+ Complete</option>
                <option value="40">40%+ Complete</option>
                <option value="20">20%+ Complete</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-card border border-neutral-stone/20 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-neutral-slate text-sm sm:text-base">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full min-w-[800px]">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider hidden lg:table-cell">
                      Industry
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider">
                      Completion
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider hidden lg:table-cell">
                      Registered
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-neutral-slate uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-stone">
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-luxury-gold to-luxury-bronze rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm sm:text-base md:text-lg">
                              {user.name?.charAt(0) || user.email.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-3 md:ml-4 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-neutral-charcoal truncate">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-slate truncate">{user.email}</div>
                            <div className="md:hidden flex items-center gap-1.5 mt-1">
                              {user.user_type === 'company' ? (
                                <Building2 className="w-3 h-3 text-purple-600" />
                              ) : (
                                <User className="w-3 h-3 text-green-600" />
                              )}
                              <span className="text-xs text-neutral-slate capitalize">
                                {user.user_type || 'Unknown'}
                              </span>
                            </div>
                            <div className="lg:hidden text-xs text-neutral-slate mt-0.5">
                              {formatDate(user.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {user.user_type === 'company' ? (
                            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                          )}
                          <span className="text-xs sm:text-sm text-neutral-charcoal capitalize">
                            {user.user_type || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-neutral-charcoal">
                          {user.industry || 'Not specified'}
                        </div>
                        {user.company_name && (
                          <div className="text-xs sm:text-sm text-neutral-slate truncate">{user.company_name}</div>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getCompletionColor(user.profile_completion_percentage)}`}>
                            {user.profile_completion_percentage}%
                          </div>
                          <div className="w-12 sm:w-16 bg-neutral-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                user.profile_completion_percentage >= 80 
                                  ? 'bg-green-500' 
                                  : user.profile_completion_percentage >= 60 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${user.profile_completion_percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-neutral-charcoal">
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                            }}
                            className="text-luxury-gold hover:text-luxury-bronze transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-luxury-gold/10 touch-manipulation"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className="text-neutral-slate hover:text-neutral-charcoal transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 touch-manipulation"
                          >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-neutral-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-neutral-slate text-center sm:text-left">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-neutral-stone hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-neutral-slate">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-neutral-stone hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl sm:rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto -webkit-overflow-scrolling-touch"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl leading-none touch-manipulation"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Name:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Email:</span>
                        <p className="text-sm sm:text-base text-gray-900 break-all">{selectedUser.email}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Phone:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Account Type:</span>
                        <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedUser.user_type || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  {selectedUser.user_type === 'company' && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Business Information</h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Company:</span>
                          <p className="text-sm sm:text-base text-gray-900">{selectedUser.company_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Employees:</span>
                          <p className="text-sm sm:text-base text-gray-900">{selectedUser.employee_count || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Website:</span>
                          <p className="text-sm sm:text-base text-gray-900 break-all">{selectedUser.website || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Industry & Preferences */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Industry & Preferences</h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Industry:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.industry || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Use Case:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.primary_use_case || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Preferred Tiles:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.preferred_tile_types || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Project Details</h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Budget:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.budget_range || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Timeline:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.project_timeline || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">How heard about us:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.how_heard_about_us || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Location</h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Country:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">City:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Address:</span>
                        <p className="text-sm sm:text-base text-gray-900">{selectedUser.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedUser.additional_notes && (
                <div className="mt-4 sm:mt-5 md:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Additional Notes</h3>
                  <p className="text-sm sm:text-base text-gray-900">{selectedUser.additional_notes}</p>
                </div>
              )}

              {/* Profile Completion */}
              <div className="mt-4 sm:mt-5 md:mt-6 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profile Completion</h3>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getCompletionColor(selectedUser.profile_completion_percentage)}`}>
                    {selectedUser.profile_completion_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-3">
                  <div 
                    className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-500 ${
                      selectedUser.profile_completion_percentage >= 80 
                        ? 'bg-green-500' 
                        : selectedUser.profile_completion_percentage >= 60 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedUser.profile_completion_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
