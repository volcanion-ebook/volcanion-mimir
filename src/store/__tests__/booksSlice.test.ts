import { configureStore } from '@reduxjs/toolkit';
import booksSlice, {
  fetchBooks,
  fetchCategories,
  searchBooks,
  addToFavorites,
  removeFromFavorites,
  addToReadingList,
  removeFromReadingList,
  updateReadingProgress,
} from '../booksSlice';

// Mock bookService
jest.mock('@/services/bookService', () => ({
  bookService: {
    getBooks: jest.fn(),
    getCategories: jest.fn(),
    searchBooks: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    getFavoriteBooks: jest.fn(),
    getReadingList: jest.fn(),
    addToReadingList: jest.fn(),
    removeFromReadingList: jest.fn(),
    updateReadingProgress: jest.fn(),
  },
}));

const mockBook = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test description',
  coverImage: 'https://example.com/cover.jpg',
  categoryId: '1',
  category: {
    id: '1',
    name: 'Fiction',
    description: 'Fiction books',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  publishedDate: '2023-01-01',
  pageCount: 200,
  language: 'en',
  isbn: '1234567890',
  rating: 4.5,
  downloadUrl: 'https://example.com/book.pdf',
  fileSize: 1024,
  format: 'PDF' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockCategory = {
  id: '1',
  name: 'Fiction',
  description: 'Fiction books',
  bookCount: 10,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      books: booksSlice,
    },
  });
};

type TestStore = ReturnType<typeof createTestStore>;

describe('booksSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().books;
      expect(state).toEqual({
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
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearError', () => {
      // Set an error first
      store.dispatch({
        type: 'books/fetchBooks/rejected',
        payload: 'Test error',
        error: { message: 'Test error' },
      });
      expect(store.getState().books.error).toBe('Test error');

      // Clear the error
      store.dispatch({ type: 'books/clearError' });
      expect(store.getState().books.error).toBeNull();
    });

    it('should handle setCurrentlyReading', () => {
      store.dispatch({ type: 'books/setCurrentlyReading', payload: mockBook });
      expect(store.getState().books.currentlyReading).toEqual(mockBook);
    });

    it('should handle clearSearchResults', () => {
      // Set search results first
      store.dispatch({
        type: 'books/searchBooks/fulfilled',
        payload: { data: [mockBook], meta: { total: 1, page: 1, limit: 10 } },
      });
      expect(store.getState().books.searchResults).toHaveLength(1);

      // Clear search results
      store.dispatch({ type: 'books/clearSearchResults' });
      expect(store.getState().books.searchResults).toHaveLength(0);
    });
  });

  describe('async thunks', () => {
    describe('fetchBooks', () => {
      it('should handle successful book fetch', async () => {
        const { bookService } = require('@/services/bookService');
        const mockResponse = {
          data: [mockBook],
          meta: { total: 1, page: 1, limit: 10 },
        };
        bookService.getBooks.mockResolvedValue(mockResponse);

        const result = await store.dispatch(fetchBooks({ limit: 10 }));

        expect(result.type).toBe('books/fetchBooks/fulfilled');
        const state = store.getState().books;
        expect(state.books).toEqual([mockBook]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should handle fetch books failure', async () => {
        const { bookService } = require('@/services/bookService');
        bookService.getBooks.mockRejectedValue(new Error('Fetch failed'));

        const result = await store.dispatch(fetchBooks({ limit: 10 }));

        expect(result.type).toBe('books/fetchBooks/rejected');
        const state = store.getState().books;
        expect(state.books).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Fetch failed');
      });
    });

    describe('fetchCategories', () => {
      it('should handle successful categories fetch', async () => {
        const { bookService } = require('@/services/bookService');
        bookService.getCategories.mockResolvedValue([mockCategory]);

        const result = await store.dispatch(fetchCategories());

        expect(result.type).toBe('books/fetchCategories/fulfilled');
        const state = store.getState().books;
        expect(state.categories).toEqual([mockCategory]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('searchBooks', () => {
      it('should handle successful book search', async () => {
        const { bookService } = require('@/services/bookService');
        const mockResponse = {
          data: [mockBook],
          meta: { total: 1, page: 1, limit: 10 },
        };
        bookService.searchBooks.mockResolvedValue(mockResponse);

        const searchParams = { query: 'test', limit: 10 };
        const result = await store.dispatch(searchBooks(searchParams));

        expect(result.type).toBe('books/searchBooks/fulfilled');
        const state = store.getState().books;
        expect(state.searchResults).toEqual([mockBook]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('addToFavorites', () => {
      it('should handle successful add to favorites', async () => {
        const { bookService } = require('@/services/bookService');
        const favoriteBook = { ...mockBook, isFavorite: true };
        bookService.addToFavorites.mockResolvedValue(favoriteBook);

        const result = await store.dispatch(addToFavorites('1'));

        expect(result.type).toBe('books/addToFavorites/fulfilled');
        const state = store.getState().books;
        expect(state.favoriteBooks).toContain(favoriteBook);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('removeFromFavorites', () => {
      it('should handle successful remove from favorites', async () => {
        const { bookService } = require('@/services/bookService');
        
        // First add a book to favorites
        store.dispatch({
          type: 'books/addToFavorites/fulfilled',
          payload: { ...mockBook, isFavorite: true },
        });

        bookService.removeFromFavorites.mockResolvedValue(undefined);

        const result = await store.dispatch(removeFromFavorites('1'));

        expect(result.type).toBe('books/removeFromFavorites/fulfilled');
        const state = store.getState().books;
        expect(state.favoriteBooks).not.toContain(expect.objectContaining({ id: '1' }));
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('addToReadingList', () => {
      it('should handle successful add to reading list', async () => {
        const { bookService } = require('@/services/bookService');
        bookService.addToReadingList.mockResolvedValue(mockBook);

        const result = await store.dispatch(addToReadingList('1'));

        expect(result.type).toBe('books/addToReadingList/fulfilled');
        const state = store.getState().books;
        expect(state.readingList).toContain(mockBook);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('updateReadingProgress', () => {
      it('should handle successful reading progress update', async () => {
        const { bookService } = require('@/services/bookService');
        const progressData = {
          bookId: '1',
          currentPage: 50,
          totalPages: 200,
          lastReadAt: '2023-01-01T00:00:00Z',
          isCompleted: false,
        };
        bookService.updateReadingProgress.mockResolvedValue(progressData);

        const result = await store.dispatch(updateReadingProgress(progressData));

        expect(result.type).toBe('books/updateReadingProgress/fulfilled');
        const state = store.getState().books;
        // Note: Since readingProgress is not in BooksState, we test that the action completed successfully
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });
  });
});
