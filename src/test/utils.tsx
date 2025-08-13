import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import authSlice from '@/store/authSlice';
import booksSlice from '@/store/booksSlice';
import notificationSlice from '@/store/notificationSlice';
import { RootState } from '@/store';

// Mock navigation container
const MockNavigationContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: Store;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authSlice,
        books: booksSlice,
        notifications: notificationSlice,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MockNavigationContainer>{children}</MockNavigationContainer>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react-native';

// Mock data helpers
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  preferences: {
    theme: 'light' as const,
    fontSize: 16,
    notifications: true,
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

export const mockBook = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test description',
  coverUrl: 'https://example.com/cover.jpg',
  fileUrl: 'https://example.com/book.pdf',
  category: 'fiction',
  publishedDate: '2023-01-01',
  isbn: '1234567890',
  language: 'en',
  pageCount: 200,
  fileSize: 1024,
  rating: 4.5,
  downloadCount: 100,
  isFavorite: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

export const mockCategory = {
  id: '1',
  name: 'Fiction',
  description: 'Fiction books',
  bookCount: 10,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

export const mockNotification = {
  id: '1',
  title: 'Test Notification',
  message: 'Test message',
  type: 'book_added' as const,
  isRead: false,
  data: {},
  createdAt: '2023-01-01T00:00:00Z',
};

export const mockAuthState = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  isLoading: false,
  error: null,
};

export const mockBooksState = {
  books: [mockBook],
  categories: [mockCategory],
  favoriteBooks: [],
  readingList: [],
  searchResults: [],
  currentBook: null,
  readingProgress: {},
  isLoading: false,
  error: null,
};

export const mockNotificationState = {
  notifications: [mockNotification],
  unreadCount: 1,
  isLoading: false,
  error: null,
};
