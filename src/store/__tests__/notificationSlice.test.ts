import { configureStore } from '@reduxjs/toolkit';
import notificationSlice, {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../notificationSlice';

// Mock notificationService
jest.mock('@/services/notificationService', () => ({
  notificationService: {
    getNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
  },
}));

const mockNotification = {
  id: '1',
  title: 'Test Notification',
  message: 'Test message',
  type: 'book_added' as const,
  isRead: false,
  data: {},
  createdAt: '2023-01-01T00:00:00Z',
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      notifications: notificationSlice,
    },
  });
};

type TestStore = ReturnType<typeof createTestStore>;

describe('notificationSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().notifications;
      expect(state).toEqual({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearError', () => {
      // Set an error first
      store.dispatch({
        type: 'notifications/fetchNotifications/rejected',
        payload: 'Test error',
        error: { message: 'Test error' },
      });
      expect(store.getState().notifications.error).toBe('Test error');

      // Clear the error
      store.dispatch({ type: 'notifications/clearError' });
      expect(store.getState().notifications.error).toBeNull();
    });

    it('should handle addNotification', () => {
      store.dispatch({ type: 'notifications/addNotification', payload: mockNotification });
      const state = store.getState().notifications;
      expect(state.notifications).toContain(mockNotification);
      expect(state.unreadCount).toBe(1);
    });
  });

  describe('async thunks', () => {
    describe('fetchNotifications', () => {
      it('should handle successful notifications fetch', async () => {
        const { notificationService } = require('@/services/notificationService');
        const mockResponse = {
          data: [mockNotification],
          meta: { total: 1, unreadCount: 1 },
        };
        notificationService.getNotifications.mockResolvedValue(mockResponse);

        const result = await store.dispatch(fetchNotifications());

        expect(result.type).toBe('notifications/fetchNotifications/fulfilled');
        const state = store.getState().notifications;
        expect(state.notifications).toEqual([mockNotification]);
        expect(state.unreadCount).toBe(1);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should handle fetch notifications failure', async () => {
        const { notificationService } = require('@/services/notificationService');
        notificationService.getNotifications.mockRejectedValue(new Error('Fetch failed'));

        const result = await store.dispatch(fetchNotifications());

        expect(result.type).toBe('notifications/fetchNotifications/rejected');
        const state = store.getState().notifications;
        expect(state.notifications).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Fetch failed');
      });
    });

    describe('markAsRead', () => {
      it('should handle successful mark as read', async () => {
        const { notificationService } = require('@/services/notificationService');
        
        // First add an unread notification
        store.dispatch({
          type: 'notifications/fetchNotifications/fulfilled',
          payload: {
            data: [mockNotification],
            meta: { total: 1, unreadCount: 1 },
          },
        });

        notificationService.markAsRead.mockResolvedValue(undefined);

        const result = await store.dispatch(markNotificationAsRead('1'));

        expect(result.type).toBe('notifications/markAsRead/fulfilled');
        const state = store.getState().notifications;
        const notification = state.notifications.find(n => n.id === '1');
        expect(notification?.isRead).toBe(true);
        expect(state.unreadCount).toBe(0);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('markAllAsRead', () => {
      it('should handle successful mark all as read', async () => {
        const { notificationService } = require('@/services/notificationService');
        
        // First add some unread notifications
        const notifications = [
          { ...mockNotification, id: '1' },
          { ...mockNotification, id: '2' },
        ];
        store.dispatch({
          type: 'notifications/fetchNotifications/fulfilled',
          payload: {
            data: notifications,
            meta: { total: 2, unreadCount: 2 },
          },
        });

        notificationService.markAllAsRead.mockResolvedValue(undefined);

        const result = await store.dispatch(markAllNotificationsAsRead());

        expect(result.type).toBe('notifications/markAllAsRead/fulfilled');
        const state = store.getState().notifications;
        expect(state.notifications.every(n => n.isRead)).toBe(true);
        expect(state.unreadCount).toBe(0);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('deleteNotification', () => {
      it('should handle successful notification deletion', async () => {
        const { notificationService } = require('@/services/notificationService');
        
        // First add a notification
        store.dispatch({
          type: 'notifications/fetchNotifications/fulfilled',
          payload: {
            data: [mockNotification],
            meta: { total: 1, unreadCount: 1 },
          },
        });

        notificationService.deleteNotification.mockResolvedValue(undefined);

        const result = await store.dispatch(deleteNotification('1'));

        expect(result.type).toBe('notifications/deleteNotification/fulfilled');
        const state = store.getState().notifications;
        expect(state.notifications.find(n => n.id === '1')).toBeUndefined();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });
  });
});
