module.exports = {
  env: {
      browser: true,
      es2021: true,
  },
  extends: [
      'react-app',
      'react-app/jest',
      'plugin:react/recommended',
  ],
  parserOptions: {
      ecmaFeatures: {
          jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
  },
  plugins: [
      'react',
  ],
  rules: {
      // Your custom rules
  },
  settings: {
      react: {
          version: 'detect', // Automatically detect the React version
      },
  },
};