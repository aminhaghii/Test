import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';
import { blogService, BlogPost } from '@/services/blogService';
import { Plus, Edit, Trash2, Eye, EyeOff, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/BrandLogo';

const BlogManagement = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin, searchTerm, filterPublished]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const filters: any = { limit: 100 };
      if (searchTerm) filters.search = searchTerm;
      if (filterPublished !== undefined) filters.is_published = filterPublished;
      
      const response = await blogService.getAdminPosts(filters);
      setPosts(response.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await blogService.deletePost(id);
      toast.success('Post deleted successfully');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <Link to="/admin/blog" className="text-xs sm:text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Blog
                </Link>
                <Link to="/admin/users" className="text-xs sm:text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Users
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-20 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal mb-1 sm:mb-2">
              Blog Management
            </h1>
            <p className="text-neutral-slate text-sm sm:text-base md:text-lg">
              Manage blog posts and articles
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/admin/blog/new')}
            className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm md:text-base touch-manipulation w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            New Post
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-slate" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base touch-manipulation"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterPublished === undefined ? "default" : "outline"}
              onClick={() => setFilterPublished(undefined)}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 touch-manipulation"
            >
              All
            </Button>
            <Button
              variant={filterPublished === true ? "default" : "outline"}
              onClick={() => setFilterPublished(true)}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 touch-manipulation"
            >
              Published
            </Button>
            <Button
              variant={filterPublished === false ? "default" : "outline"}
              onClick={() => setFilterPublished(false)}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 touch-manipulation"
            >
              Drafts
            </Button>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-slate">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-neutral-stone/20">
            <p className="text-neutral-slate mb-4">No blog posts found</p>
            <Button
              onClick={() => navigate('/admin/blog/new')}
              className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl sm:rounded-2xl border border-neutral-stone/20 overflow-hidden">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full min-w-[600px]">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">Title</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-neutral-charcoal hidden md:table-cell">Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-neutral-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="font-semibold text-neutral-charcoal text-xs sm:text-sm md:text-base">{post.title}</div>
                        <div className="text-xs sm:text-sm text-neutral-slate mt-1">{post.slug}</div>
                        <div className="md:hidden text-xs text-neutral-slate mt-1">
                          {formatDate(post.created_at)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          post.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {post.is_published ? (
                            <>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-neutral-slate hidden md:table-cell">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/blog/${post.id}`)}
                            className="rounded-full h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 touch-manipulation"
                          >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 touch-manipulation"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;

