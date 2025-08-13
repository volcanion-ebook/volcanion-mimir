import { configureStore } from '@reduxjs/toolkit';
import authSlice, {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  loadUserFromStorage,
} from '../authSlice';

// Mock authService
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    updateUser: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

// Mock AsyncStorage
const mockAsyncStorage = {
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

const mockUser = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  avatar: null,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
  });
};

type TestStore = ReturnType<typeof createTestStore>;

describe('authSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearError', () => {
      // Set an error first by dispatching a rejected action
      store.dispatch({
        type: 'auth/loginUser/rejected',
        payload: 'Test error',
        error: { message: 'Test error' },
      });
      expect(store.getState().auth.error).toBe('Test error');

      // Clear the error
      store.dispatch({ type: 'auth/clearError' });
      expect(store.getState().auth.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    describe('loginUser', () => {
      it('should handle successful login', async () => {
        const { authService } = require('@/services/authService');
        const mockResponse = {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh',
        };
        authService.login.mockResolvedValue(mockResponse);

        const loginData = { email: 'test@example.com', password: 'password' };
        const result = await store.dispatch(loginUser(loginData));

        expect(result.type).toBe('auth/login/fulfilled');
        const state = store.getState().auth;
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('mock-token');
        expect(state.refreshToken).toBe('mock-refresh');
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(true);
      });

      it('should handle login failure', async () => {
        const { authService } = require('@/services/authService');
        authService.login.mockRejectedValue(new Error('Login failed'));

        const loginData = { email: 'test@example.com', password: 'password' };
        const result = await store.dispatch(loginUser(loginData));

        expect(result.type).toBe('auth/login/rejected');
        const state = store.getState().auth;
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Login failed');
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('registerUser', () => {
      it('should handle successful registration', async () => {
        const { authService } = require('@/services/authService');
        const mockResponse = {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh',
        };
        authService.register.mockResolvedValue(mockResponse);

        const registerData = {
          email: 'test@example.com',
          password: 'password',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        };
        const result = await store.dispatch(registerUser(registerData));

        expect(result.type).toBe('auth/register/fulfilled');
        const state = store.getState().auth;
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('mock-token');
        expect(state.refreshToken).toBe('mock-refresh');
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(true);
      });
    });

    describe('updateUser', () => {
      it('should handle successful user update', async () => {
        const { authService } = require('@/services/authService');
        const updatedUser = { ...mockUser, firstName: 'Updated' };
        authService.updateUser.mockResolvedValue(updatedUser);

        // Set initial authenticated state
        store.dispatch({
          type: 'auth/loginUser/fulfilled',
          payload: {
            user: mockUser,
            accessToken: 'token',
            refreshToken: 'refresh',
          },
        });

        const updateData = { firstName: 'Updated' };
        const result = await store.dispatch(updateUser(updateData));

        expect(result.type).toBe('auth/updateUser/fulfilled');
        const state = store.getState().auth;
        expect(state.user?.firstName).toBe('Updated');
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('loadUserFromStorage', () => {
      it('should load user from storage successfully', async () => {
        const { authService } = require('@/services/authService');
        mockAsyncStorage.multiGet.mockResolvedValue([
          ['accessToken', 'stored-token'],
          ['refreshToken', 'stored-refresh'],
        ]);
        authService.getCurrentUser.mockResolvedValue(mockUser);

        const result = await store.dispatch(loadUserFromStorage());

        expect(result.type).toBe('auth/loadFromStorage/fulfilled');
        const state = store.getState().auth;
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('stored-token');
        expect(state.refreshToken).toBe('stored-refresh');
        expect(state.isAuthenticated).toBe(true);
      });

      it('should handle missing tokens in storage', async () => {
        mockAsyncStorage.multiGet.mockResolvedValue([
          ['accessToken', null],
          ['refreshToken', null],
        ]);

        const result = await store.dispatch(loadUserFromStorage());

        expect(result.type).toBe('auth/loadFromStorage/fulfilled');
        const state = store.getState().auth;
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('logoutUser', () => {
      it('should handle logout', async () => {
        // Set authenticated state first
        store.dispatch({
          type: 'auth/loginUser/fulfilled',
          payload: {
            user: mockUser,
            accessToken: 'token',
            refreshToken: 'refresh',
          },
        });

        const result = await store.dispatch(logoutUser());

        expect(result.type).toBe('auth/logout/fulfilled');
        const state = store.getState().auth;
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });
});
