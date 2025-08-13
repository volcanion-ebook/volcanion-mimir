// Test setup file

// Set development mode for tests
(globalThis as any).__DEV__ = true;

// Mock React DOM batching
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  unstable_batchedUpdates: (fn: () => void) => fn(),
}));

// Provide global batch function for React Redux
(globalThis as any).unstable_batchedUpdates = (fn: () => void) => fn();

// Mock React Native modules
jest.mock('react-native', () => {
  return {
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj: any) => obj.ios),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    StyleSheet: {
      create: jest.fn((styles: any) => styles),
      flatten: jest.fn((style: any) => style),
    },
    Text: 'Text',
    View: 'View',
    TouchableOpacity: 'TouchableOpacity',
    TextInput: 'TextInput',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    Image: 'Image',
    Pressable: 'Pressable',
    ActivityIndicator: 'ActivityIndicator',
    SafeAreaView: 'SafeAreaView',
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

// Mock Push Notifications
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve(true)),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  popInitialNotification: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  registerHeadlessTask: jest.fn(),
  clearAllNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
  invokeApp: jest.fn(),
  getChannels: jest.fn(),
  channelExists: jest.fn(),
  createChannel: jest.fn(),
  channelBlocked: jest.fn(),
  deleteChannel: jest.fn(),
}));

// Mock Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'MockedIcon');

// Global test setup
(globalThis as any).__DEV__ = true;

// Silence console warnings during tests
(globalThis as any).console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
