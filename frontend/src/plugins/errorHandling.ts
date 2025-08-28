import type { App } from 'vue';
import * as Sentry from '@sentry/vue';
import { useSnackbarStore } from '@/stores/snackbar';

export default {
  install(app: App) {
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (dsn) {
      Sentry.init({
        app,
        dsn
      });
    }

    const defaultHandler = app.config.errorHandler;

    app.config.errorHandler = (err, instance, info) => {
      if (dsn) Sentry.captureException(err);
      useSnackbarStore().showError(err);
      defaultHandler?.(err, instance, info);
    };
  }
};
