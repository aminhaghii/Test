import { supabase, Product } from '@/lib/supabase';

export interface ProductFilter {
  dimensions?: string[];
  surfaces?: string[];
  bodyTypes?: string[];
  categories?: string[];
  searchTerm?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ProductService {
  /**
   * Get all products with filters and pagination
   */
  async getProducts(
    filters: ProductFilter = {},
    pagination?: PaginationParams
  ): Promise<ProductListResponse> {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.dimensions && filters.dimensions.length > 0) {
        query = query.in('dimension', filters.dimensions);
      }

      if (filters.surfaces && filters.surfaces.length > 0) {
        query = query.in('surface', filters.surfaces);
      }

      if (filters.bodyTypes && filters.bodyTypes.length > 0) {
        query = query.in('body_type', filters.bodyTypes);
      }

      if (filters.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      if (filters.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
      }

      // Apply pagination
      if (pagination) {
        const { page, pageSize } = pagination;
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);
      }

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: data || [],
        total: count || 0,
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || data?.length || 0,
        totalPages: pagination ? Math.ceil((count || 0) / pagination.pageSize) : 1
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  /**
   * Upload product image to storage
   */
  async uploadImage(file: File, productId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Delete image from storage
   */
  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('products')
        .remove([imagePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Generate slug from product name
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get filter options (dimensions, surfaces, etc.)
   */
  async getFilterOptions(): Promise<{
    dimensions: string[];
    surfaces: string[];
    bodyTypes: string[];
    categories: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('dimension, surface, body_type, category')
        .eq('is_active', true);

      if (error) throw error;

      const dimensions = [...new Set(data?.map(p => p.dimension))].filter(Boolean);
      const surfaces = [...new Set(data?.map(p => p.surface))].filter(Boolean);
      const bodyTypes = [...new Set(data?.map(p => p.body_type))].filter(Boolean);
      const categories = [...new Set(data?.map(p => p.category))].filter(Boolean);

      return {
        dimensions: dimensions as string[],
        surfaces: surfaces as string[],
        bodyTypes: bodyTypes as string[],
        categories: categories as string[]
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      return {
        dimensions: [],
        surfaces: [],
        bodyTypes: [],
        categories: []
      };
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Bulk update products
   */
  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<Product> }>): Promise<boolean> {
    try {
      const promises = updates.map(({ id, data }) => 
        this.updateProduct(id, data)
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error bulk updating products:', error);
      return false;
    }
  }

  /**
   * Bulk delete products
   */
  async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      return false;
    }
  }
}

export const productService = new ProductService();
