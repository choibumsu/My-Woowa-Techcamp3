module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  rules: {},
}