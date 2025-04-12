import { ApiService } from './api';
import { Parent } from '../types';

interface LoginResponse {
  token: string;
  parent: Parent;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService extends ApiService {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/api/auth/login', data);
      localStorage.setItem('auth-token', response.token);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/api/auth/register', data);
      localStorage.setItem('auth-token', response.token);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post('/api/auth/logout');
      localStorage.removeItem('auth-token');
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur, on supprime le token
      localStorage.removeItem('auth-token');
    }
  }

  async getProfile(): Promise<Parent> {
    try {
      return await this.get<Parent>('/api/auth/profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionData: Parent['subscription']): Promise<Parent> {
    try {
      return await this.put<Parent>('/api/auth/subscription', subscriptionData);
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token');
  }
}

export default new AuthService();
