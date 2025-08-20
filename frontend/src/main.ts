/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { useAuthStore } from '@/stores/auth'
import { useSnackbarStore } from '@/stores/snackbar'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Global error handler:', err, vm, info)
  useSnackbarStore().showError()
}

registerPlugins(app)

const auth = useAuthStore()
if (!auth.currentUser) auth.init()

app.mount('#app')
