module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-unused-vars': 'off',
      },
    },
  ],
  rules: {
    'react-native/no-inline-styles': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
