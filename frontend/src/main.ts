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

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Global error handler:', err, vm, info)
  // In a real application, you would display a user-friendly error message
  // For now, we'll just log it and show a simple alert.
  alert('An unexpected error occurred. Please check the console for details.')
}

registerPlugins(app)

const auth = useAuthStore()
if (!auth.currentUser) auth.init()

app.mount('#app')
