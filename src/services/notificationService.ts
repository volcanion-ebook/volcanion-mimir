import {Notification, PushNotificationSettings} from '@/types/common';
import PushNotification from 'react-native-push-notification';

const API_BASE_URL = 'https://api.volcanion-ebook.com/v1'; // Replace with your actual API URL

class NotificationService {
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

  // Initialize push notifications
  initializePushNotifications(): void {
    PushNotification.configure({
      onRegister: (token: any) => {
        console.log('Token:', token);
        this.registerDeviceToken(token.token);
      },

      onNotification: (notification: any) => {
        console.log('Notification:', notification);

        // Handle notification tap
        if (notification.userInteraction) {
          this.handleNotificationTap(notification);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  private async registerDeviceToken(token: string): Promise<void> {
    try {
      await this.makeRequest<void>('/notifications/register-device', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({deviceToken: token}),
      });
    } catch (error) {
      console.error('Failed to register device token:', error);
    }
  }

  private handleNotificationTap(notification: any): void {
    // Handle navigation based on notification data
    if (notification.data) {
      const {type, bookId, categoryId} = notification.data;

      switch (type) {
        case 'NEW_BOOK':
          if (bookId) {
            // Navigate to book details screen
            console.log('Navigate to book:', bookId);
          }
          break;
        case 'NEW_CATEGORY':
          if (categoryId) {
            // Navigate to category screen
            console.log('Navigate to category:', categoryId);
          }
          break;
        default:
          // Navigate to notifications screen
          console.log('Navigate to notifications');
          break;
      }
    }
  }

  // API methods
  async getNotifications(): Promise<Notification[]> {
    return this.makeRequest<Notification[]>('/notifications', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.makeRequest<void>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
  }

  async markAllAsRead(): Promise<void> {
    return this.makeRequest<void>('/notifications/read-all', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this.makeRequest<void>(`/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async getNotificationSettings(): Promise<PushNotificationSettings> {
    return this.makeRequest<PushNotificationSettings>('/notifications/settings', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async updateNotificationSettings(settings: PushNotificationSettings): Promise<void> {
    return this.makeRequest<void>('/notifications/settings', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });
  }

  // Local notification helpers
  showLocalNotification(title: string, message: string, data?: any): void {
    PushNotification.localNotification({
      title,
      message,
      userInfo: data,
      playSound: true,
      soundName: 'default',
    });
  }

  scheduleLocalNotification(title: string, message: string, date: Date, data?: any): void {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      userInfo: data,
      playSound: true,
      soundName: 'default',
    });
  }

  cancelAllLocalNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  // Reading reminder notifications
  scheduleReadingReminder(bookTitle: string, reminderTime: Date): void {
    this.scheduleLocalNotification(
      'Reading Reminder',
      `Continue reading "${bookTitle}"`,
      reminderTime,
      {type: 'READING_REMINDER'},
    );
  }

  // Badge management
  setBadgeCount(count: number): void {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  clearBadge(): void {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

export const notificationService = new NotificationService();
