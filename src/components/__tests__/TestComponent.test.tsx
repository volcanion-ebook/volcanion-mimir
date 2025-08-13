import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Simple test component
const TestComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View testID="test-component">
      <Text>{title}</Text>
    </View>
  );
};

describe('TestComponent', () => {
  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<TestComponent title="Hello World" />);
    
    expect(getByText('Hello World')).toBeTruthy();
    expect(getByTestId('test-component')).toBeTruthy();
  });

  it('should render with different title', () => {
    const { getByText } = render(<TestComponent title="Different Title" />);
    
    expect(getByText('Different Title')).toBeTruthy();
  });
});
