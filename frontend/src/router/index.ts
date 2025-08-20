/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { hasRole, useAuthStore } from '@/stores/auth'
import { Role } from '@/types'
import { setupRouterLoading } from './loading'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

setupRouterLoading(router)

router.beforeEach((to) => {
  const auth = useAuthStore()
  const role = auth.currentUser == null ? Role.Guest : auth.currentUser.role

  if (
    ['/login', '/register', '/auth/login', '/auth/register'].includes(to.path) &&
    role !== Role.Guest
  )
    return '/'

  const allowedRoles = to.meta.roles as Role[] | undefined
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.some((r) => hasRole(role, r))) {
    return '/error/403'
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')

  if (import.meta.env.DEV) {
    const assertLayout = (path: string, expected: string) => {
      const resolved = router.resolve(path)
      const actual = resolved.meta.layout as string | undefined
      if (actual !== expected) {
        console.error(
          `[layout-check] Expected layout "${expected}" for route "${path}" but got "${String(actual)}".`,
          resolved
        )
      }
    }

    assertLayout('/login', 'empty')
    assertLayout('/register', 'empty')
    for (const p of ['/error/401', '/error/403', '/error/404', '/error/500']) {
      assertLayout(p, 'empty')
    }
  }
})

export default router
