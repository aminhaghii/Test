import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  author_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostFilters {
  limit?: number;
  offset?: number;
  search?: string;
  is_published?: boolean;
}

export interface BlogPostResponse {
  posts: BlogPost[];
  total: number;
  limit: number;
  offset: number;
}

class BlogService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Get auth token
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/blog${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors (connection refused, etc.)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('API server is not available. Please check if the backend server is running.');
      }
      throw error;
    }
  }

  async getPosts(filters: BlogPostFilters = {}): Promise<BlogPostResponse> {
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.search) params.append('search', filters.search);

    const query = params.toString();
    return this.request<BlogPostResponse>(query ? `?${query}` : '');
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/${slug}`);
  }

  async getAdminPosts(filters: BlogPostFilters = {}): Promise<BlogPostResponse> {
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.is_published !== undefined) params.append('is_published', filters.is_published ? '1' : '0');

    const query = params.toString();
    return this.request<BlogPostResponse>(`/admin${query ? `?${query}` : ''}`);
  }

  async getAdminPost(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/admin/${id}`);
  }

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    return this.request<BlogPost>('', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    return this.request<BlogPost>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
  }
}

export const blogService = new BlogService();

