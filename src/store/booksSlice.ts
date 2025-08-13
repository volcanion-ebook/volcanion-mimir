import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {BooksState, Book, GetBooksRequest, SearchBooksRequest, ReadingProgress} from '@/types/book';
import {bookService} from '@/services/bookService';

const initialState: BooksState = {
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
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: GetBooksRequest, {rejectWithValue}) => {
    try {
      const response = await bookService.getBooks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'books/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      const response = await bookService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  },
);

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (params: SearchBooksRequest, {rejectWithValue}) => {
    try {
      const response = await bookService.searchBooks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  },
);

export const fetchFavoriteBooks = createAsyncThunk(
  'books/fetchFavoriteBooks',
  async (_, {rejectWithValue}) => {
    try {
      const response = await bookService.getFavoriteBooks();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch favorite books');
    }
  },
);

export const addToFavorites = createAsyncThunk(
  'books/addToFavorites',
  async (bookId: string, {rejectWithValue}) => {
    try {
      await bookService.addToFavorites(bookId);
      const book = await bookService.getBookById(bookId);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to favorites');
    }
  },
);

export const removeFromFavorites = createAsyncThunk(
  'books/removeFromFavorites',
  async (bookId: string, {rejectWithValue}) => {
    try {
      await bookService.removeFromFavorites(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from favorites');
    }
  },
);

export const fetchReadingList = createAsyncThunk(
  'books/fetchReadingList',
  async (_, {rejectWithValue}) => {
    try {
      const response = await bookService.getReadingList();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reading list');
    }
  },
);

export const addToReadingList = createAsyncThunk(
  'books/addToReadingList',
  async (bookId: string, {rejectWithValue}) => {
    try {
      await bookService.addToReadingList(bookId);
      const book = await bookService.getBookById(bookId);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to reading list');
    }
  },
);

export const removeFromReadingList = createAsyncThunk(
  'books/removeFromReadingList',
  async (bookId: string, {rejectWithValue}) => {
    try {
      await bookService.removeFromReadingList(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from reading list');
    }
  },
);

export const updateReadingProgress = createAsyncThunk(
  'books/updateReadingProgress',
  async (progress: ReadingProgress, {rejectWithValue}) => {
    try {
      await bookService.updateReadingProgress(progress);
      return progress;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update reading progress');
    }
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearSearchResults: state => {
      state.searchResults = [];
    },
    setCurrentlyReading: (state, action: PayloadAction<Book>) => {
      state.currentlyReading = action.payload;
    },
    clearCurrentlyReading: state => {
      state.currentlyReading = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.data;
        state.pagination = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Search Books
      .addCase(searchBooks.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.error = null;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Favorite Books
      .addCase(fetchFavoriteBooks.fulfilled, (state, action) => {
        state.favoriteBooks = action.payload;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favoriteBooks.push(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favoriteBooks = state.favoriteBooks.filter(book => book.id !== action.payload);
      })

      // Reading List
      .addCase(fetchReadingList.fulfilled, (state, action) => {
        state.readingList = action.payload;
      })
      .addCase(addToReadingList.fulfilled, (state, action) => {
        state.readingList.push(action.payload);
      })
      .addCase(removeFromReadingList.fulfilled, (state, action) => {
        state.readingList = state.readingList.filter(book => book.id !== action.payload);
      });
  },
});

export const {clearError, clearSearchResults, setCurrentlyReading, clearCurrentlyReading} =
  booksSlice.actions;

export default booksSlice.reducer;
