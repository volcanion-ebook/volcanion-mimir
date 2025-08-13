export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  categoryId: string;
  category: Category;
  publishedDate: string;
  pageCount: number;
  language: string;
  isbn: string;
  rating: number;
  downloadUrl: string;
  fileSize: number;
  format: 'PDF' | 'EPUB' | 'MOBI';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BooksState {
  books: Book[];
  categories: Category[];
  favoriteBooks: Book[];
  readingList: Book[];
  currentlyReading: Book | null;
  searchResults: Book[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface GetBooksRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'title' | 'author' | 'publishedDate' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchBooksRequest {
  query: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  isCompleted: boolean;
}
