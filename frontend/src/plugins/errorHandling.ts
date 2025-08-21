import type { App } from 'vue'
import * as Sentry from '@sentry/vue'
import { useSnackbarStore } from '@/stores/snackbar'

export default {
  install(app: App) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
    })

    const defaultHandler = app.config.errorHandler

    app.config.errorHandler = (err, instance, info) => {
      Sentry.captureException(err)
      useSnackbarStore().showError(err)
      defaultHandler?.(err, instance, info)
    }
  },
}
