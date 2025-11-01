import api from '@/lib/api';

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

export interface Product {
  id: string;
  name: string;
  slug: string;
  dimension: string;
  surface: string;
  body_type: string;
  color?: string;
  category?: string;
  price?: number;
  stock_quantity?: number;
  image_url?: string;
  additional_images?: string[];
  texture_images?: string[];
  features?: string[];
  packaging?: string[];
  description?: string;
  technical_specs?: Record<string, string | number | boolean>;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ProductService {
  async getProducts(
    filters: ProductFilter = {},
    pagination?: PaginationParams
  ): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters.dimensions?.length) params.append('dimensions', filters.dimensions.join(','));
    if (filters.surfaces?.length) params.append('surfaces', filters.surfaces.join(','));
    if (filters.bodyTypes?.length) params.append('bodyTypes', filters.bodyTypes.join(','));
    if (filters.categories?.length) params.append('categories', filters.categories.join(','));
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (pagination?.page) params.append('page', String(pagination.page));
    if (pagination?.pageSize) params.append('pageSize', String(pagination.pageSize));

    const { data } = await api.get(`/api/products?${params}`);
    return data;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data } = await api.post('/api/products', product);
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data } = await api.put(`/api/products/${id}`, updates);
    return data;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await api.delete(`/api/products/${id}`);
    return true;
  }

  async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    await api.post('/api/products/bulk-delete', { ids });
    return true;
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const { data } = await api.post('/api/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return `http://localhost:3001${data.url}`;
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async getFilterOptions(): Promise<{
    dimensions: string[];
    surfaces: string[];
    bodyTypes: string[];
    categories: string[];
  }> {
    const { data } = await api.get('/api/products/meta/filters');
    return data;
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const { data } = await api.get(`/api/products?featured=true&pageSize=${limit}`);
    return data.products || [];
  }
}

export const productService = new ProductService();
