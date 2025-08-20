import type { Router } from 'vue-router'
import { ref } from 'vue'

export const loading = ref(false)

export function setupRouterLoading(router: Router) {
  router.beforeEach(() => {
    loading.value = true
  })
  router.afterEach(() => {
    loading.value = false
  })
}
