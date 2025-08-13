export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'NEW_BOOK' | 'NEW_CATEGORY' | 'READING_REMINDER' | 'SYSTEM';
  data?: {
    bookId?: string;
    categoryId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface PushNotificationSettings {
  enabled: boolean;
  newBooks: boolean;
  newCategories: boolean;
  readingReminders: boolean;
  systemNotifications: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
