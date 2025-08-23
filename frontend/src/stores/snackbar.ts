import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const message = ref('');
  const color = ref('success');
  const visible = ref(false);
  const timeout = ref(3000);

  function showSnackbar(msg: string, clr = 'success', tmt = 3000) {
    message.value = msg;
    color.value = clr;
    timeout.value = tmt;
    visible.value = true;
  }

  function showError(
    errorOrMessage?: unknown,
    msg = 'An unexpected error occurred. Please check the console for details.'
  ) {
    if (typeof errorOrMessage === 'string') {
      msg = errorOrMessage;
    } else if (errorOrMessage != null) {
      console.error(errorOrMessage);
    }
    showSnackbar(msg, 'error');
  }

  function hideSnackbar() {
    visible.value = false;
  }

  return {
    message,
    color,
    visible,
    timeout,
    showSnackbar,
    showError,
    hideSnackbar
  };
});
