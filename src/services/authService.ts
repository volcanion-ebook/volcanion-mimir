import {LoginRequest, RegisterRequest, AuthResponse, UpdateUserRequest, User} from '@/types/auth';

const API_BASE_URL = 'https://api.volcanion-ebook.com/v1'; // Replace with your actual API URL

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    // Get token from AsyncStorage in a real implementation
    const token = ''; // This should be retrieved from storage
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return this.makeRequest<void>('/auth/logout', {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({refreshToken}),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async updateProfile(userData: UpdateUserRequest): Promise<User> {
    return this.makeRequest<User>('/auth/profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.makeRequest<void>('/auth/change-password', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({currentPassword, newPassword}),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    return this.makeRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({email}),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.makeRequest<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({token, newPassword}),
    });
  }
}

export const authService = new AuthService();
