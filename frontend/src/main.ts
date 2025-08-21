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
import '@/css/transitions.scss'

const app = createApp(App)

registerPlugins(app)

const auth = useAuthStore()
if (!auth.currentUser) auth.init()

app.mount('#app')
