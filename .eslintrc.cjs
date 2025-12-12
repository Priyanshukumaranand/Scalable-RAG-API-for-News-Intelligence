/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
