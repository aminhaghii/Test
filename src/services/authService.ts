import axios from 'axios';
import { getApiUrl } from '@/lib/getApiUrl';

const API_URL = getApiUrl();

// Add axios interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('token');
      
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') && 
        !currentPath.includes('/register') &&
        !currentPath.includes('/admin/login')
      ) {
        // Token is invalid, user should be logged out
        console.warn('Session expired or invalid token. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  user_type?: 'personal' | 'company';
  company_name?: string;
  employee_count?: string;
  industry?: string;
  primary_use_case?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  address?: string;
  preferred_tile_types?: string;
  budget_range?: string;
  project_timeline?: string;
  how_heard_about_us?: string;
  additional_notes?: string;
  profile_completion_percentage: number;
  profile_updated_at?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  user_type?: 'personal' | 'company';
  company_name?: string;
  employee_count?: string;
  industry?: string;
  primary_use_case?: string;
}

export interface ProfileData {
  name?: string;
  user_type?: 'personal' | 'company';
  company_name?: string;
  employee_count?: string;
  industry?: string;
  primary_use_case?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  address?: string;
  preferred_tile_types?: string;
  budget_range?: string;
  project_timeline?: string;
  how_heard_about_us?: string;
  additional_notes?: string;
}

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterData) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async login(email: string, password: string, turnstileToken?: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
        turnstileToken
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async googleLogin(credential: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/google`, { credential }, {
        withCredentials: true
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.response?.data?.error || 'Google login failed');
    }
  }

  async logout() {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      // If token is invalid, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
  }

  async getProfile(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      // If token is invalid, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
  }

  async updateProfile(data: ProfileData): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  }

  // Admin methods
  async getAllUsers(filters: {
    page?: number;
    limit?: number;
    user_type?: string;
    industry?: string;
    min_completion?: number;
    search?: string;
  } = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_URL}/api/auth/admin/users?${params}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw new Error(error.response?.data?.error || 'Failed to get users');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/api/auth/admin/users/${userId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      throw new Error(error.response?.data?.error || 'Failed to get user');
    }
  }

  async updateUser(userId: string, data: ProfileData): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/api/auth/admin/users/${userId}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      throw new Error(error.response?.data?.error || 'User update failed');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();
