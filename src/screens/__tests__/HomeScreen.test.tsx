import React from 'react';
import {renderWithProviders} from '@/test/utils';
import HomeScreen from '@/screens/home/HomeScreen';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from '@/store/authSlice';
import booksSlice from '@/store/booksSlice';
import notificationSlice from '@/store/notificationSlice';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock services
jest.mock('@/services/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('@/services/bookService', () => ({
  getBooks: jest.fn(() => Promise.resolve({data: [], pagination: {}})),
  getCategories: jest.fn(() => Promise.resolve({data: []})),
  getBookById: jest.fn(),
  searchBooks: jest.fn(),
  getFeaturedBooks: jest.fn(),
  getBooksByCategory: jest.fn(),
}));

jest.mock('@/services/notificationService', () => ({
  getNotifications: jest.fn(() => Promise.resolve({data: []})),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  deleteNotification: jest.fn(),
}));

describe('HomeScreen', () => {
  const createTestStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        auth: authSlice,
        books: booksSlice,
        notifications: notificationSlice,
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          accessToken: 'test-token',
          refreshToken: 'refresh-token',
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
        books: {
          books: [],
          categories: [],
          favoriteBooks: [],
          readingList: [],
          currentlyReading: null,
          searchResults: [],
          isLoading: false,
          error: null,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            hasNext: false,
            hasPrevious: false,
          },
        },
        notifications: {
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          error: null,
        },
        ...initialState,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with user name', () => {
    const store = createTestStore();
    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Hello, Test!')).toBeTruthy();
    expect(getByText('What would you like to read today?')).toBeTruthy();
  });

  it('should render main sections', () => {
    const store = createTestStore();
    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Categories')).toBeTruthy();
    expect(getByText('Featured Books')).toBeTruthy();
    expect(getByText('Quick Actions')).toBeTruthy();
  });

  it('should render quick action buttons', () => {
    const store = createTestStore();
    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Continue Reading')).toBeTruthy();
    expect(getByText('My Favorites')).toBeTruthy();
    expect(getByText('Reading List')).toBeTruthy();
    expect(getByText('Search Books')).toBeTruthy();
  });

  it('should display categories when available', () => {
    const mockCategories = [
      {
        id: '1',
        name: 'Fiction',
        description: 'Fiction books',
        imageUrl: 'https://example.com/fiction.jpg',
      },
      {
        id: '2',
        name: 'Science',
        description: 'Science books',
        imageUrl: 'https://example.com/science.jpg',
      },
    ];

    const store = createTestStore({
      books: {
        books: [],
        categories: mockCategories,
        favoriteBooks: [],
        readingList: [],
        currentlyReading: null,
        searchResults: [],
        isLoading: false,
        error: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
      },
    });

    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Fiction')).toBeTruthy();
    expect(getByText('Science')).toBeTruthy();
  });

  it('should display books when available', () => {
    const mockBooks = [
      {
        id: '1',
        title: 'Test Book 1',
        author: 'Test Author 1',
        coverImage: 'https://example.com/book1.jpg',
        description: 'Test description',
        publishedDate: '2023-01-01',
        isbn: '1234567890',
        categories: ['fiction'],
        rating: 4.5,
        totalRatings: 100,
        isFavorite: false,
        readingProgress: 0,
        fileUrl: 'https://example.com/book1.pdf',
        fileSize: 1024,
        language: 'en',
      },
      {
        id: '2',
        title: 'Test Book 2',
        author: 'Test Author 2',
        coverImage: 'https://example.com/book2.jpg',
        description: 'Test description 2',
        publishedDate: '2023-01-02',
        isbn: '1234567891',
        categories: ['science'],
        rating: 4.0,
        totalRatings: 50,
        isFavorite: true,
        readingProgress: 0.5,
        fileUrl: 'https://example.com/book2.pdf',
        fileSize: 2048,
        language: 'en',
      },
    ];

    const store = createTestStore({
      books: {
        books: mockBooks,
        categories: [],
        favoriteBooks: [],
        readingList: [],
        currentlyReading: null,
        searchResults: [],
        isLoading: false,
        error: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          hasNext: false,
          hasPrevious: false,
        },
      },
    });

    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Test Book 1')).toBeTruthy();
    expect(getByText('Test Author 1')).toBeTruthy();
    expect(getByText('Test Book 2')).toBeTruthy();
    expect(getByText('Test Author 2')).toBeTruthy();
  });

  it('should render with default user name when user is not available', () => {
    const store = createTestStore({
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });

    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('Hello, Reader!')).toBeTruthy();
  });

  it('should render notification button', () => {
    const store = createTestStore();
    const {getByText} = renderWithProviders(<HomeScreen />, {store});

    expect(getByText('🔔')).toBeTruthy();
  });
});
