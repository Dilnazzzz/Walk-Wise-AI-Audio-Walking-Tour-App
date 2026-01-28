module.exports = {
  root: true,
  extends: ['universe/native', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: ['metro.config.js', 'server/**/*.js'],
      env: { node: true },
      rules: { 'no-console': 'off' },
    },
  ],
};
