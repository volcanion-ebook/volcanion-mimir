import {
  validateEmail,
  formatFileSize,
  truncateText,
  capitalizeFirstLetter,
  isValidPassword,
} from '../helpers';

describe('Helper Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false); // no TLD
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2097152)).toBe('2 MB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
      expect(truncateText('Hello World', 15)).toBe('Hello World');
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hi', 2)).toBe('Hi');
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
      expect(capitalizeFirstLetter('UPPERCASE')).toBe('UPPERCASE');
    });

    it('should handle edge cases', () => {
      expect(capitalizeFirstLetter('')).toBe('');
      expect(capitalizeFirstLetter('a')).toBe('A');
      expect(capitalizeFirstLetter('123')).toBe('123');
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('MyPassword1')).toBe(true);
      expect(isValidPassword('Complex1Pass')).toBe(true);
      expect(isValidPassword('Test123@')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('password')).toBe(false); // no uppercase or number
      expect(isValidPassword('PASSWORD')).toBe(false); // no lowercase or number
      expect(isValidPassword('Password')).toBe(false); // no number
      expect(isValidPassword('pass123')).toBe(false); // too short
      expect(isValidPassword('12345678')).toBe(false); // no letters
      expect(isValidPassword('')).toBe(false); // empty
    });
  });
});
