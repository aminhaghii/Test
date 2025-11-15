import axios from 'axios';

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
  stock_quantity: number;
  image_url?: string;
  additional_images?: string[];
  texture_images?: string[];
  features?: string[];
  packaging?: string[];
  description?: string;
  technical_specs?: any;
  decor_image_url?: string;
  thickness?: number;
  absorption_rate?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

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
  private baseURL: string;

  constructor() {
    // Use dynamic API URL detection for mobile compatibility
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = '3001';
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        this.baseURL = `http://${hostname}:${port}`;
      } else {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      }
    } else {
      this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    }
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get all products with filters and pagination
   */
  async getProducts(
    filters: ProductFilter = {},
    pagination?: PaginationParams
  ): Promise<ProductListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dimensions?.length) {
        params.append('dimensions', filters.dimensions.join(','));
      }
      if (filters.surfaces?.length) {
        params.append('surfaces', filters.surfaces.join(','));
      }
      if (filters.bodyTypes?.length) {
        params.append('bodyTypes', filters.bodyTypes.join(','));
      }
      if (filters.categories?.length) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters.searchTerm) {
        params.append('search', filters.searchTerm);
      }
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      if (filters.isFeatured !== undefined) {
        params.append('featured', filters.isFeatured.toString());
      }
      if (pagination) {
        params.append('page', pagination.page.toString());
        params.append('pageSize', pagination.pageSize.toString());
      }

      const response = await axios.get(`${this.baseURL}/api/products?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
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
      const response = await axios.get(`${this.baseURL}/api/products/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      const response = await axios.post(`${this.baseURL}/api/products`, product, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
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
      const response = await axios.put(`${this.baseURL}/api/products/${id}`, updates, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      await axios.delete(`${this.baseURL}/api/products/${id}`, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  /**
   * Upload product image
   */
  async uploadImage(file: File, productId?: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${this.baseURL}/api/upload/single`, formData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple product images
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post(`${this.baseURL}/api/upload/multiple`, formData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.images.map((img: any) => img.url);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
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
      const response = await axios.get(`${this.baseURL}/api/products/meta/filters`);
      return response.data;
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
      const response = await this.getProducts({ isFeatured: true }, { page: 1, pageSize: limit });
      return response.products;
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
      await axios.post(`${this.baseURL}/api/products/bulk-delete`, { ids }, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      return false;
    }
  }
}

export const productService = new ProductService();
