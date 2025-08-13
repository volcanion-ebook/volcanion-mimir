import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar, Platform} from 'react-native';
import 'react-native-gesture-handler';

import {store, persistor} from '@/store';
import AppNavigator from '@/navigation/AppNavigator';
import {notificationService} from '@/services/notificationService';
import {useAppDispatch} from '@/hooks/redux';
import {loadUserFromStorage} from '@/store/authSlice';

// Loading component for PersistGate
const Loading: React.FC = () => {
  return null; // You can add a loading spinner here
};

// App content component that has access to Redux store
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize push notifications
    notificationService.initializePushNotifications();

    // Load user from storage
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#007AFF"
      />
      <AppNavigator />
    </>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
