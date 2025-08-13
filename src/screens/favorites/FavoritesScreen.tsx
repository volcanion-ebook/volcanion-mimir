import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {fetchFavoriteBooks, removeFromFavorites} from '@/store/booksSlice';
import {Book} from '@/types/book';

const FavoritesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {favoriteBooks} = useAppSelector(state => state.books);

  useEffect(() => {
    dispatch(fetchFavoriteBooks());
  }, [dispatch]);

  const handleRemoveFromFavorites = (bookId: string) => {
    dispatch(removeFromFavorites(bookId));
  };

  const renderBookItem = ({item}: {item: Book}) => (
    <View style={styles.bookItem}>
      <Image source={{uri: item.coverImage}} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromFavorites(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (favoriteBooks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite books yet</Text>
        <Text style={styles.emptySubtext}>Add books to your favorites to see them here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bookItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  bookCategory: {
    fontSize: 12,
    color: '#007AFF',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
