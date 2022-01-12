module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // dev
    'no-unused-vars': 'warn',
    'no-unused-expressions': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'warn'
  }
}
