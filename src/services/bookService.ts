import {Book, Category, GetBooksRequest, SearchBooksRequest, ReadingProgress} from '@/types/book';
import {PaginationMeta} from '@/types/common';

const API_BASE_URL = 'https://api.volcanion-ebook.com/v1'; // Replace with your actual API URL

interface BooksResponse {
  data: Book[];
  meta: PaginationMeta;
}

class BookService {
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

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return searchParams.toString();
  }

  async getBooks(params: GetBooksRequest = {}): Promise<BooksResponse> {
    const queryString = this.buildQueryString(params);
    const endpoint = `/books${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<BooksResponse>(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getBookById(bookId: string): Promise<Book> {
    return this.makeRequest<Book>(`/books/${bookId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.makeRequest<Category[]>('/categories', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async searchBooks(params: SearchBooksRequest): Promise<BooksResponse> {
    const queryString = this.buildQueryString(params);
    const endpoint = `/books/search${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<BooksResponse>(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getFavoriteBooks(): Promise<Book[]> {
    return this.makeRequest<Book[]>('/user/favorites', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async addToFavorites(bookId: string): Promise<void> {
    return this.makeRequest<void>('/user/favorites', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({bookId}),
    });
  }

  async removeFromFavorites(bookId: string): Promise<void> {
    return this.makeRequest<void>(`/user/favorites/${bookId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async getReadingList(): Promise<Book[]> {
    return this.makeRequest<Book[]>('/user/reading-list', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async addToReadingList(bookId: string): Promise<void> {
    return this.makeRequest<void>('/user/reading-list', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({bookId}),
    });
  }

  async removeFromReadingList(bookId: string): Promise<void> {
    return this.makeRequest<void>(`/user/reading-list/${bookId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async getReadingProgress(bookId: string): Promise<ReadingProgress> {
    return this.makeRequest<ReadingProgress>(`/user/reading-progress/${bookId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async updateReadingProgress(progress: ReadingProgress): Promise<void> {
    return this.makeRequest<void>('/user/reading-progress', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(progress),
    });
  }

  async downloadBook(bookId: string): Promise<string> {
    const response = await this.makeRequest<{downloadUrl: string}>(`/books/${bookId}/download`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return response.downloadUrl;
  }

  async getBooksByCategory(
    categoryId: string,
    params: GetBooksRequest = {},
  ): Promise<BooksResponse> {
    const queryString = this.buildQueryString({...params, categoryId});
    const endpoint = `/categories/${categoryId}/books${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<BooksResponse>(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getPopularBooks(limit: number = 10): Promise<Book[]> {
    return this.makeRequest<Book[]>(`/books/popular?limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async getRecentlyAddedBooks(limit: number = 10): Promise<Book[]> {
    return this.makeRequest<Book[]>(`/books/recent?limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }
}

export const bookService = new BookService();
