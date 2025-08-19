import vuetify from 'eslint-config-vuetify'

export default vuetify(
  {},
  {
    files: ['src/router/index.ts'],
    rules: {
      'import/no-duplicates': 'off',
    },
  },
)
