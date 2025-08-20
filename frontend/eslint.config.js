import prettierConfig from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'
import prettierPlugin from 'eslint-plugin-prettier'
import vueScopedCss from 'eslint-plugin-vue-scoped-css'

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
      'vue-scoped-css': vueScopedCss,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue-scoped-css/no-unused-selector': 'warn',
    },
  }
)
