import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { productService, Product } from '@/services/productServiceBackend';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, ArrowLeft, Upload, X, Image as ImageIcon,
  Loader2, CheckCircle, Home, LogOut, Star, ArrowUp, ArrowDown, Plus, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  dimension: z.string().min(1, 'Dimension is required'),
  surface: z.string().min(1, 'Surface is required'),
  body_type: z.string().min(1, 'Body type is required'),
  color: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0).optional(),
  stock_quantity: z.number().min(0).optional(),
  description: z.string().optional(),
  is_featured: z.boolean(),
  is_active: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Temporarily disable auth
  const isAdmin = true;
  const authLoading = false;
  const user = { id: 'admin-1', name: 'Admin' };
  // const { isAdmin, isLoading: authLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedTextureImages, setUploadedTextureImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [packaging, setPackaging] = useState<string[]>(['']);
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id && id !== 'new';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      dimension: '60x60',
      surface: 'Matt',
      body_type: 'Porcelain',
      color: 'White',
      category: 'Floor Tiles',
      price: 0,
      stock_quantity: 100,
      description: '',
      is_featured: false,
      is_active: true
    }
  });

  // Dropdown options matching the seeded products
  const dimensions = ['30x30', '30x90', '40x40', '40x100', '60x60', '60x120', '80x80', '100x100'];
  const surfaces = ['Matt', 'Polished', 'Glossy', 'Textured', 'Satin'];
  const bodyTypes = ['Ceramic', 'Porcelain', 'Marble', 'Granite', 'Quartz'];
  const categories = ['Wall Tiles', 'Floor Tiles', 'Bathroom', 'Kitchen', 'Living Room'];
  const colors = ['White', 'Gray', 'Cream', 'Brown', 'Black', 'Beige', 'Green', 'Red', 'Yellow', 'Blue', 'Multi'];

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadProduct = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await productService.getProductById(id);
      
      if (data) {
        setProduct(data);
        setValue('name', data.name);
        setValue('dimension', data.dimension);
        setValue('surface', data.surface);
        setValue('body_type', data.body_type);
        setValue('color', data.color || '');
        setValue('category', data.category || '');
        setValue('price', data.price || 0);
        setValue('stock_quantity', data.stock_quantity || 0);
        setValue('description', data.description || '');
        setValue('is_featured', data.is_featured);
        setValue('is_active', data.is_active);
        
        if (data.image_url) {
          setUploadedImages([data.image_url]);
        }
        if (data.additional_images) {
          setUploadedImages(prev => [...prev, ...data.additional_images!]);
        }
        if (data.texture_images) {
          setUploadedTextureImages(data.texture_images);
        }
        if (data.features) {
          setFeatures(data.features.length > 0 ? data.features : ['']);
        }
        if (data.packaging) {
          setPackaging(data.packaging.length > 0 ? data.packaging : ['']);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    if (isEditMode && isAdmin) {
      loadProduct();
    }
  }, [isEditMode, isAdmin, loadProduct]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      
      // Validate file sizes
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        toast.error(`${oversizedFiles.length} file(s) are too large. Maximum size is 5MB.`);
        return;
      }
      
      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error(`${invalidFiles.length} file(s) have invalid format. Only JPG, PNG, and WebP are allowed.`);
        return;
      }
      
      // Limit total images
      if (uploadedImages.length + acceptedFiles.length > 10) {
        toast.error('Maximum 10 images allowed per product');
        return;
      }
      
      const uploadPromises = acceptedFiles.map(file => 
        productService.uploadImage(file)
      );
      
      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      
      toast.success(`${acceptedFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    maxFiles: 10
  });

  const onDropTexture = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      
      // Validate file sizes
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        toast.error(`${oversizedFiles.length} file(s) are too large. Maximum size is 5MB.`);
        return;
      }
      
      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error(`${invalidFiles.length} file(s) have invalid format. Only JPG, PNG, and WebP are allowed.`);
        return;
      }
      
      // Limit total images
      if (uploadedTextureImages.length + acceptedFiles.length > 10) {
        toast.error('Maximum 10 texture images allowed per product');
        return;
      }
      
      const uploadPromises = acceptedFiles.map(file => 
        productService.uploadImage(file)
      );
      
      const urls = await Promise.all(uploadPromises);
      setUploadedTextureImages(prev => [...prev, ...urls]);
      
      toast.success(`${acceptedFiles.length} texture image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading texture images:', error);
      toast.error('Failed to upload texture images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps: getTextureRootProps, getInputProps: getTextureInputProps, isDragActive: isTextureDragActive } = useDropzone({
    onDrop: onDropTexture,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    maxFiles: 10
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return; // Already primary
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(index, 1);
      newImages.unshift(movedImage);
      return newImages;
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);

      const slug = productService.generateSlug(data.name);
      
      const productData = {
        ...data,
        slug,
        image_url: uploadedImages[0] || null,
        additional_images: uploadedImages.slice(1),
        texture_images: uploadedTextureImages,
        features: features.filter(f => f.trim() !== ''),
        packaging: packaging.filter(p => p.trim() !== ''),
        price: data.price || null,
        stock_quantity: data.stock_quantity || 0,
        [isEditMode ? 'updated_by' : 'created_by']: user?.id
      };

      if (isEditMode && id) {
        await productService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-luxury-gold" />
      </div>
    );
  }

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
                <Link to="/admin" className="text-sm font-medium text-neutral-slate hover:text-luxury-gold transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-sm font-medium text-luxury-gold border-b-2 border-luxury-gold pb-1">
                  Products
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/admin/products')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="font-display text-4xl font-bold text-neutral-charcoal">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-neutral-slate mt-1">
              {isEditMode ? 'Update product information' : 'Create a new product in your catalog'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Basic Information
            </h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                  Product Name *
                </label>
                <Input
                  {...register('name')}
                  placeholder="e.g., ANAK LIGHT GRAY"
                  className="text-base"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Dimension, Surface, Body Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Dimension *
                  </label>
                  <select
                    {...register('dimension')}
                    className="w-full px-4 py-3 border border-neutral-stone rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    {dimensions.map(dim => (
                      <option key={dim} value={dim}>{dim}</option>
                    ))}
                  </select>
                  {errors.dimension && (
                    <p className="text-red-600 text-sm mt-1">{errors.dimension.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Surface *
                  </label>
                  <select
                    {...register('surface')}
                    className="w-full px-4 py-3 border border-neutral-stone rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    {surfaces.map(surface => (
                      <option key={surface} value={surface}>{surface}</option>
                    ))}
                  </select>
                  {errors.surface && (
                    <p className="text-red-600 text-sm mt-1">{errors.surface.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Body Type *
                  </label>
                  <select
                    {...register('body_type')}
                    className="w-full px-4 py-3 border border-neutral-stone rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.body_type && (
                    <p className="text-red-600 text-sm mt-1">{errors.body_type.message}</p>
                  )}
                </div>
              </div>

              {/* Color & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Color
                  </label>
                  <select
                    {...register('color')}
                    className="w-full px-4 py-3 border border-neutral-stone rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    <option value="">Select color</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-neutral-stone rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                  Description
                </label>
                <Textarea
                  {...register('description')}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="text-base"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                  Price (Optional)
                </label>
                <Input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
                  Stock Quantity
                </label>
                <Input
                  {...register('stock_quantity', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="text-base"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Product Images
            </h2>

            {/* Enhanced Drag & Drop Upload Area */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive 
                  ? 'border-luxury-gold bg-luxury-gold/5' 
                  : 'border-neutral-stone hover:border-luxury-gold hover:bg-neutral-alabaster/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-luxury-gold' : 'text-neutral-slate'}`} />
              <p className="text-neutral-charcoal font-medium mb-2">
                {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
              </p>
              <p className="text-sm text-neutral-slate">
                Maximum file size: 5MB per image. Supported formats: JPG, PNG, WebP
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {/* Uploaded Images Grid */}
            {uploadedImages.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-charcoal">
                    Uploaded Images ({uploadedImages.length})
                  </h3>
                  <p className="text-sm text-neutral-slate">
                    First image will be used as the main product image
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((url, index) => {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                    const imageUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
                    
                    return (
                    <div key={index} className="relative group bg-white rounded-lg border border-neutral-stone/20 overflow-hidden shadow-sm">
                      <div className="aspect-square relative">
                        <img
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className="p-1.5 bg-luxury-gold text-white rounded-full hover:bg-luxury-bronze"
                              title="Set as primary"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Reorder Buttons */}
                        {uploadedImages.length > 1 && (
                          <div className="absolute left-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index - 1)}
                                className="p-1 bg-white/90 text-neutral-charcoal rounded hover:bg-white"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                            )}
                            {index < uploadedImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index + 1)}
                                className="p-1 bg-white/90 text-neutral-charcoal rounded hover:bg-white"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-luxury-gold text-white text-xs font-semibold rounded shadow-sm">
                            Primary
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2">
                        <p className="text-xs text-neutral-slate truncate">
                          Image {index + 1}
                        </p>
                        {index === 0 && (
                          <p className="text-xs text-luxury-gold font-medium">
                            Main Image
                          </p>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Status */}
            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-luxury-gold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading images...</span>
              </div>
            )}

            {/* File Rejection Errors */}
            {fileRejections.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Some files were rejected:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {fileRejections.map(({ file, errors }) => (
                    <li key={file.name} className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span className="font-medium">{file.name}</span>
                      <span>- {errors.map(e => e.message).join(', ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Texture Images */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Texture & Environment Images
            </h2>

            {/* Enhanced Drag & Drop Upload Area */}
            <div 
              {...getTextureRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isTextureDragActive 
                  ? 'border-luxury-gold bg-luxury-gold/5' 
                  : 'border-neutral-stone hover:border-luxury-gold hover:bg-neutral-alabaster/50'
              }`}
            >
              <input {...getTextureInputProps()} />
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isTextureDragActive ? 'text-luxury-gold' : 'text-neutral-slate'}`} />
              <p className="text-neutral-charcoal font-medium mb-2">
                {isTextureDragActive ? 'Drop texture images here' : 'Drag & drop texture images or click to browse'}
              </p>
              <p className="text-sm text-neutral-slate">
                Maximum file size: 5MB per image. Supported formats: JPG, PNG, WebP
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {/* Uploaded Texture Images Grid */}
            {uploadedTextureImages.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-charcoal">
                    Texture Images ({uploadedTextureImages.length})
                  </h3>
                  <p className="text-sm text-neutral-slate">
                    Environment and texture context images
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedTextureImages.map((url, index) => {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                    const imageUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
                    
                    return (
                    <div key={index} className="relative group bg-white rounded-lg border border-neutral-stone/20 overflow-hidden shadow-sm">
                      <div className="aspect-video relative">
                        <img
                          src={imageUrl}
                          alt={`Texture ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedTextureImages(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-neutral-slate truncate">
                          Texture {index + 1}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Features Management */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Product Features
            </h2>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index] = e.target.value;
                      setFeatures(newFeatures);
                    }}
                    placeholder="Enter feature (e.g., Water Resistant, Scratch Proof)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFeatures = features.filter((_, i) => i !== index);
                      setFeatures(newFeatures.length > 0 ? newFeatures : ['']);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFeatures([...features, ''])}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>

          {/* Packaging Management */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Packaging Information
            </h2>
            
            <div className="space-y-4">
              {packaging.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newPackaging = [...packaging];
                      newPackaging[index] = e.target.value;
                      setPackaging(newPackaging);
                    }}
                    placeholder="Enter packaging info (e.g., Pack of 10, Box size: 60x60cm)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPackaging = packaging.filter((_, i) => i !== index);
                      setPackaging(newPackaging.length > 0 ? newPackaging : ['']);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setPackaging([...packaging, ''])}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Packaging Info
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-neutral-stone/20">
            <h2 className="font-display text-2xl font-bold text-neutral-charcoal mb-6">
              Settings
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('is_featured')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-neutral-stone text-luxury-gold focus:ring-luxury-gold"
                />
                <div>
                  <div className="font-semibold text-neutral-charcoal">Featured Product</div>
                  <div className="text-sm text-neutral-slate">Display this product in featured sections</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-neutral-stone text-luxury-gold focus:ring-luxury-gold"
                />
                <div>
                  <div className="font-semibold text-neutral-charcoal">Active</div>
                  <div className="text-sm text-neutral-slate">Make this product visible on the website</div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              variant="outline"
              className="px-8 py-6"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold px-8 py-6 rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
