import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../auth/LoginScreen';
import { renderWithProviders } from '@/test/utils';
import { loginUser } from '@/store/authSlice';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the Redux actions
jest.mock('@/store/authSlice', () => ({
  ...jest.requireActual('@/store/authSlice'),
  loginUser: jest.fn(),
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Sign up")).toBeTruthy();
  });

  it('should show error when fields are empty', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
  });

  it('should show error for invalid email', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a valid email address');
    });
  });

  it('should handle successful login', async () => {
    const mockDispatch = jest.fn();
    mockDispatch.mockResolvedValue({ unwrap: () => Promise.resolve() });
    
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />, {
      store: {
        dispatch: mockDispatch,
        getState: () => ({
          auth: {
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          },
        }),
        subscribe: () => () => {},
        replaceReducer: () => {},
      } as any,
    });

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should handle login failure', async () => {
    const mockDispatch = jest.fn();
    mockDispatch.mockResolvedValue({ 
      unwrap: () => Promise.reject('Login failed') 
    });
    
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />, {
      store: {
        dispatch: mockDispatch,
        getState: () => ({
          auth: {
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          },
        }),
        subscribe: () => () => {},
        replaceReducer: () => {},
      } as any,
    });

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', 'Login failed');
    });
  });

  it('should navigate to register screen when sign up is pressed', () => {
    const { getByText } = renderWithProviders(<LoginScreen />);

    const signUpButton = getByText("Don't have an account? Sign up");
    fireEvent.press(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should show loading state when login is in progress', () => {
    const { getByText } = renderWithProviders(<LoginScreen />, {
      preloadedState: {
        auth: {
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: true,
          isAuthenticated: false,
          error: null,
        },
      },
    });

    const loginButton = getByText('Logging in...');
    expect(loginButton).toBeTruthy();
    expect(loginButton.props.disabled).toBe(true);
  });
});
