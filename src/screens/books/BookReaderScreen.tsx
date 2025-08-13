import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@/navigation/AppNavigator';

type BookReaderScreenProps = StackScreenProps<AppStackParamList, 'BookReader'>;

const BookReaderScreen: React.FC<BookReaderScreenProps> = ({route}) => {
  const {bookId} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book Reader Screen</Text>
      <Text style={styles.subtext}>Reading Book ID: {bookId}</Text>
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

export default BookReaderScreen;
