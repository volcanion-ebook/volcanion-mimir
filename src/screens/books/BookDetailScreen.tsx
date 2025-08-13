import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@/navigation/AppNavigator';

type BookDetailScreenProps = StackScreenProps<AppStackParamList, 'BookDetail'>;

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({route}) => {
  const {bookId} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book Detail Screen</Text>
      <Text style={styles.subtext}>Book ID: {bookId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtext: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
});

export default BookDetailScreen;
