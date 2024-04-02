import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.js',
    ],
  }, {
  rules: {
    'no-console': 0,
  },
})
