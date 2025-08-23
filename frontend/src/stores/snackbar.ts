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
    defaultMsg = 'An unexpected error occurred. Please check the console for details.'
  ) {
    let displayMessage = defaultMsg;
    let stackTrace = '';

    if (errorOrMessage instanceof Error) {
      displayMessage = errorOrMessage.message;
      if (errorOrMessage.stack) {
        // Take the first few lines of the stack trace
        stackTrace = errorOrMessage.stack.split('\n').slice(0, 3).join('\n');
      }
      console.error(errorOrMessage); // Still log to console for full details
    } else if (typeof errorOrMessage === 'string') {
      displayMessage = errorOrMessage;
    } else if (errorOrMessage != null) {
      console.error(errorOrMessage);
    }

    const fullMessage = stackTrace ? `${displayMessage}\n\n${stackTrace}` : displayMessage;
    showSnackbar(fullMessage, 'error', 8000); // Increase timeout for longer messages
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
