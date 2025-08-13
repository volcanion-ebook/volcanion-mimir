# Volcanion E-Book Application

A comprehensive React Native e-book reading application with authentication, book management, favorites, reading lists, and push notifications.

## Features

### Authentication & User Management
- ✅ User registration and login
- ✅ JWT access token and refresh token handling
- ✅ Session management with Redux Toolkit
- ✅ User profile management
- ✅ Secure logout functionality

### Book Management
- ✅ Browse books by categories with pagination
- ✅ Search functionality for books, authors, and categories
- ✅ Book details and reading interface
- ✅ Favorites system
- ✅ Reading list management
- ✅ Reading progress tracking

### Notifications
- ✅ Push notifications for new books and categories
- ✅ Reading reminders
- ✅ Notification management system
- ✅ Badge count for unread notifications

### User Interface
- ✅ Modern, intuitive design
- ✅ Bottom tab navigation
- ✅ Stack navigation for detailed views
- ✅ Responsive layout
- ✅ Loading states and error handling

## Technology Stack

- **Framework**: React Native 0.72.6
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation 6
- **Languages**: TypeScript
- **Storage**: AsyncStorage
- **Push Notifications**: react-native-push-notification
- **Icons**: React Native Vector Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── books/          # Book-related screens
│   ├── favorites/      # Favorites screen
│   ├── home/           # Home screen
│   ├── notifications/  # Notifications screen
│   ├── profile/        # Profile screen
│   ├── reading/        # Reading list screen
│   ├── search/         # Search screen
│   └── settings/       # Settings screen
├── services/           # API service layer
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd volcanion-mimir
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **iOS Setup** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration**
   - Update API endpoints in service files
   - Configure push notification settings
   - Set up authentication keys

## Running the Application

### Development

1. **Start Metro bundler**
   ```bash
   yarn start
   ```

2. **Run on Android**
   ```bash
   yarn android
   ```

3. **Run on iOS**
   ```bash
   yarn ios
   ```

### Other Scripts

- **Type checking**: `yarn type-check`
- **Linting**: `yarn lint`
- **Testing**: `yarn test`
- **Clean cache**: `yarn clean:cache`

### Build for Production

1. **Android**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **iOS**
   - Open `ios/VolcanionEbook.xcworkspace` in Xcode
   - Select "Product" → "Archive"

## API Integration

The application is designed to work with a RESTful API. Update the API endpoints in the service files:

- `src/services/authService.ts` - Authentication endpoints
- `src/services/bookService.ts` - Book management endpoints
- `src/services/notificationService.ts` - Notification endpoints

### Required API Endpoints

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile

**Books**
- `GET /books` - Get books with pagination
- `GET /books/:id` - Get book details
- `GET /books/search` - Search books
- `GET /categories` - Get categories
- `GET /user/favorites` - Get favorite books
- `POST /user/favorites` - Add to favorites
- `DELETE /user/favorites/:id` - Remove from favorites
- `GET /user/reading-list` - Get reading list
- `POST /user/reading-list` - Add to reading list
- `DELETE /user/reading-list/:id` - Remove from reading list

**Notifications**
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/register-device` - Register device token

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication and profile data
- **booksSlice**: Books, categories, favorites, and reading lists
- **notificationSlice**: Notifications and settings

Data persistence is handled by Redux Persist with AsyncStorage.

## Push Notifications

Push notifications are implemented using `react-native-push-notification`. The system supports:

- New book notifications
- New category notifications
- Reading reminders
- Custom notification settings

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Use meaningful component and variable names

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a React Native application that requires a backend API to be fully functional. The service files contain placeholder API endpoints that need to be updated with your actual backend URLs.
