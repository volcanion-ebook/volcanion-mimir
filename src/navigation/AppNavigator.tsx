import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

// Import screens
import SplashScreen from '@/screens/SplashScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookListScreen from '@/screens/books/BookListScreen';
import BookDetailScreen from '@/screens/books/BookDetailScreen';
import BookReaderScreen from '@/screens/books/BookReaderScreen';
import SearchScreen from '@/screens/search/SearchScreen';
import FavoritesScreen from '@/screens/favorites/FavoritesScreen';
import ReadingListScreen from '@/screens/reading/ReadingListScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';

import {useSelector} from 'react-redux';
import {RootState} from '@/store';

// Type definitions for navigation
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  ReadingList: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Main: undefined;
  BookDetail: {bookId: string};
  BookReader: {bookId: string};
  BookList: {categoryId?: string; title?: string};
  Notifications: undefined;
  Settings: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const AppStack = createStackNavigator<AppStackParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const {unreadCount} = useSelector((state: RootState) => state.notifications);

  return (
    <MainTab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconText: string;
          const iconColor = focused ? color : '#666';

          switch (route.name) {
            case 'Home':
              iconText = '🏠';
              break;
            case 'Search':
              iconText = '🔍';
              break;
            case 'Favorites':
              iconText = '❤️';
              break;
            case 'ReadingList':
              iconText = '📚';
              break;
            case 'Profile':
              iconText = '👤';
              break;
            default:
              iconText = '❓';
          }

          return <Text style={{fontSize: size * 0.8, color: iconColor}}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}>
      <MainTab.Screen name="Home" component={HomeScreen} options={{title: 'Home'}} />
      <MainTab.Screen name="Search" component={SearchScreen} options={{title: 'Search'}} />
      <MainTab.Screen name="Favorites" component={FavoritesScreen} options={{title: 'Favorites'}} />
      <MainTab.Screen
        name="ReadingList"
        component={ReadingListScreen}
        options={{
          title: 'Reading List',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <MainTab.Screen name="Profile" component={ProfileScreen} options={{title: 'Profile'}} />
    </MainTab.Navigator>
  );
};

// App Navigator (includes modals and full-screen screens)
const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}>
      <AppStack.Screen name="Main" component={MainTabNavigator} options={{headerShown: false}} />
      <AppStack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{title: 'Book Details'}}
      />
      <AppStack.Screen
        name="BookReader"
        component={BookReaderScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name="BookList"
        component={BookListScreen}
        options={({route}) => ({
          title: route.params?.title || 'Books',
        })}
      />
      <AppStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
      />
      <AppStack.Screen name="Settings" component={SettingsScreen} options={{title: 'Settings'}} />
    </AppStack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const {isAuthenticated, isLoading} = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
      }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={AppStackNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

// Main App Navigator Component
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
