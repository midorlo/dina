/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import type { Router } from 'vue-router';
import type { Role } from '@/data/mock-data.ts';

import { setupLayouts } from 'virtual:generated-layouts';
import { ref } from 'vue';
// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes)
});

export const loading = ref(false);

export function setupRouterLoading(router: Router) {
  router.beforeEach(() => {
    loading.value = true;
  });
  router.afterEach(() => {
    loading.value = false;
  });
}

setupRouterLoading(router);

router.beforeEach(to => {
  const auth = useAuthStore();

  console.log('Navigating to:', to.fullPath);
  console.log('Route Meta Roles:', to.meta.roles);
  console.log('Current User Role:', auth.currentUser?.role);
  console.log('Is Logged In:', auth.isLoggedIn);
  console.log('Is Guest:', auth.isGuest);

  if (to.meta.requiresGuest && !auth.isGuest) {
    console.log('Redirecting: requiresGuest and not guest');
    return '/';
  }

  const allowedRoles = to.meta.roles as Role[] | undefined;
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(r => auth.hasRole(r));
    console.log('Allowed Roles:', allowedRoles);
    console.log('Has Required Role:', hasRequiredRole);
    if (!hasRequiredRole) {
      console.log('Redirecting: does not have required role');
      return '/error/403';
    }
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err);
    } else {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');

  if (import.meta.env.DEV) {
    const assertLayout = (path: string, expected: string) => {
      const resolved = router.resolve(path);
      const actual = resolved.meta.layout as string | undefined;
      if (actual !== expected) {
        console.error(
          `[layout-check] Expected layout "${expected}" for route "${path}" but got "${String(actual)}".`,
          resolved
        );
      }
    };

    assertLayout('/login', 'empty');
    assertLayout('/register', 'empty');
    for (const p of ['/error/401', '/error/403', '/error/404', '/error/500']) {
      assertLayout(p, 'empty');
    }
  }
});

export default router;
