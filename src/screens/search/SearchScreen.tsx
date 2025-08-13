import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {searchBooks, clearSearchResults} from '@/store/booksSlice';
import {Book} from '@/types/book';

const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {searchResults} = useAppSelector(state => state.books);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchBooks({query: searchQuery.trim()}));
    }
  };

  const renderBookItem = ({item}: {item: Book}) => (
    <TouchableOpacity style={styles.bookItem}>
      <Image source={{uri: item.coverImage}} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors, categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books found</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for books to get started</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default SearchScreen;
