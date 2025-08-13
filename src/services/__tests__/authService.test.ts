import { authService } from '../authService';

// Mock fetch for Node.js environment
(globalThis as any).fetch = jest.fn();

const mockFetch = (globalThis as any).fetch as jest.MockedFunction<typeof fetch>;

describe('authService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatar: undefined,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const loginData = { email: 'test@example.com', password: 'password' };
      const result = await authService.login(loginData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.volcanion-ebook.com/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      const loginData = { email: 'test@example.com', password: 'wrong-password' };

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.volcanion-ebook.com/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(loginData),
        })
      );
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const loginData = { email: 'test@example.com', password: 'password' };

      await expect(authService.login(loginData)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatar: undefined,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const registerData = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const result = await authService.register(registerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.volcanion-ebook.com/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Email already exists' }),
      } as Response);

      const registerData = {
        email: 'existing@example.com',
        password: 'password',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      };

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: undefined,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.volcanion-ebook.com/v1/auth/me',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle unauthorized access', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      } as Response);

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Updated',
        lastName: 'User',
        avatar: undefined,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUser,
      } as Response);

      const updateData = { firstName: 'Updated' };
      const result = await authService.updateProfile(updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.volcanion-ebook.com/v1/auth/profile',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(updatedUser);
    });

    it('should handle update failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid data' }),
      } as Response);

      const updateData = { firstName: '' };

      await expect(authService.updateProfile(updateData)).rejects.toThrow('Invalid data');
    });
  });
});
