module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': 0,
    'react/button-has-type': 0,
    'react/jsx-closing-tag-location': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-param-reassign': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'default-case': 0,
  },
};
