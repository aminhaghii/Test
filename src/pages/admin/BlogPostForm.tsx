import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/BackendAuthContext';
import { authService } from '@/services/authService';
import { blogService, BlogPost } from '@/services/blogService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Upload, Home, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import BrandLogo from '@/components/BrandLogo';

const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image_url: z.string().optional(),
  is_published: z.boolean(),
  published_at: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditMode = !!id && id !== 'new';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      is_published: false,
      published_at: '',
    }
  });

  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && watchedTitle && !watchedSlug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, watchedSlug, isEditMode, setValue]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditMode && id) {
      loadPost();
    }
  }, [id, isEditMode]);

  const loadPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await blogService.getAdminPost(id);
      
      if (data) {
        setPost(data);
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('excerpt', data.excerpt || '');
        setValue('content', data.content);
        setValue('image_url', data.image_url || '');
        setValue('is_published', data.is_published);
        setValue('published_at', data.published_at || '');
        if (data.image_url) {
          setImagePreview(data.image_url.startsWith('http') ? data.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${data.image_url}`);
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      // Check if user is authenticated
      if (!user) {
        toast.error('Please log in to upload images');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      // Get auth token
      const token = authService.getToken();
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setIsUploading(false);
        return;
      }

      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/upload/single`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data.url;
      
      setValue('image_url', imageUrl);
      setImagePreview(imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${imageUrl}`);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error.message || 'Failed to upload image';
      toast.error(errorMessage);
      
      // If unauthorized, suggest re-login
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Please log in again to upload images');
      }
    } finally {
      setIsUploading(false);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: false
  });

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      setIsLoading(true);

      const postData = {
        ...data,
        published_at: data.is_published && !data.published_at 
          ? new Date().toISOString() 
          : data.published_at || undefined,
      };

      if (isEditMode && id) {
        await blogService.updatePost(id, postData);
        toast.success('Blog post updated successfully');
      } else {
        await blogService.createPost(postData);
        toast.success('Blog post created successfully');
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save blog post');
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

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-slate">Loading post...</p>
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
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/blog')}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 touch-manipulation w-full sm:w-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-charcoal">
                {isEditMode ? 'Edit Blog Post' : 'New Blog Post'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-neutral-stone/20 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Title *
              </label>
              <Input
                {...register('title')}
                placeholder="Enter post title"
                className="w-full text-sm sm:text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              {errors.title && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Slug *
              </label>
              <Input
                {...register('slug')}
                placeholder="post-url-slug"
                className="w-full font-mono text-sm sm:text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              {errors.slug && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.slug.message}</p>
              )}
              <p className="text-neutral-slate text-[10px] sm:text-xs mt-1">
                URL-friendly version of the title (lowercase, hyphens only)
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Excerpt
              </label>
              <Textarea
                {...register('excerpt')}
                placeholder="Short description of the post"
                className="w-full min-h-[80px] sm:min-h-[100px] text-sm sm:text-base touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Content *
              </label>
              <Textarea
                {...register('content')}
                placeholder="Write your blog post content here..."
                className="w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] font-mono text-xs sm:text-sm touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              {errors.content && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Featured Image
              </label>
              
              {imagePreview ? (
                <div className="relative mb-3 sm:mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImagePreview('');
                      setValue('image_url', '');
                    }}
                    className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 touch-manipulation"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 sm:p-7 md:p-8 text-center cursor-pointer transition-colors touch-manipulation ${
                    isDragActive
                      ? 'border-luxury-gold bg-luxury-gold/10'
                      : 'border-neutral-stone/30 hover:border-luxury-gold/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto text-neutral-slate mb-3 sm:mb-4" />
                  {isUploading ? (
                    <p className="text-neutral-slate text-xs sm:text-sm">Uploading...</p>
                  ) : (
                    <>
                      <p className="text-neutral-charcoal font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-neutral-slate text-xs sm:text-sm">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </>
                  )}
                </div>
              )}
              
              <Input
                {...register('image_url')}
                placeholder="Or enter image URL directly"
                className="w-full mt-3 sm:mt-4 text-sm sm:text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-charcoal mb-1.5 sm:mb-2">
                Published Date
              </label>
              <Input
                {...register('published_at')}
                type="datetime-local"
                className="w-full text-sm sm:text-base h-11 sm:h-12 md:h-13 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              <p className="text-neutral-slate text-[10px] sm:text-xs mt-1">
                Leave empty to use current date/time when publishing
              </p>
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                {...register('is_published')}
                id="is_published"
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-neutral-stone/30 text-luxury-gold focus:ring-luxury-gold touch-manipulation"
              />
              <label htmlFor="is_published" className="text-xs sm:text-sm font-semibold text-neutral-charcoal cursor-pointer touch-manipulation">
                Publish immediately
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/blog')}
              className="rounded-full text-xs sm:text-sm px-6 sm:px-7 md:px-8 py-3 sm:py-4 md:py-6 touch-manipulation w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-6 sm:px-7 md:px-8 py-3 sm:py-4 md:py-6 rounded-full text-xs sm:text-sm md:text-base touch-manipulation w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  {isEditMode ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostForm;

