import prettierConfig from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'
import prettierPlugin from 'eslint-plugin-prettier'

export default vuetify(
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.vite/', '*.log', '*.bak'],
  },
  {
    files: ['src/router/index.ts'],
    rules: {
      'import/no-duplicates': 'off',
    },
  },
  // Add Prettier configuration
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  }
)
