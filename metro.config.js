const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@': './src',
      '@/components': './src/components',
      '@/screens': './src/screens',
      '@/store': './src/store',
      '@/services': './src/services',
      '@/types': './src/types',
      '@/utils': './src/utils',
      '@/hooks': './src/hooks',
      '@/navigation': './src/navigation',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
