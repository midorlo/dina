import type { AuthTokens, Profile, User } from '@/types';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { type Permission, Role } from '@/data/mock-data';
import { hasPermission as checkPermission, guestUser, roleAtLeast } from '@/data/mock-data';

import router from '@/router';

import { useSnackbarStore } from '@/stores/snackbar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    userProfile: null as Profile | null,
    tokens: null as AuthTokens | null
  }),
  persist: {
    storage: typeof window === 'undefined' ? undefined : sessionStorage,
    paths: ['currentUser', 'userProfile']
  } as any,
  getters: {
    hasValidToken: state => !!(state.tokens?.accessToken && state.tokens.accessTokenExpiresAt > Date.now()),
    isLoggedIn: state =>
      state.currentUser !== null &&
      state.currentUser.role !== Role.Guest &&
      !!(state.tokens?.accessToken && state.tokens.accessTokenExpiresAt > Date.now()),
    isGuest: state =>
      !(
        state.currentUser !== null &&
        state.currentUser.role !== Role.Guest &&
        !!(state.tokens?.accessToken && state.tokens.accessTokenExpiresAt > Date.now())
      ),
    hasRole: state => (requiredRole: Role) => {
      if (requiredRole === Role.Any) {
        return true; // Any role is allowed
      }
      if (state.currentUser === null) {
        return false;
      }
      return roleAtLeast(state.currentUser.role, requiredRole);
    }
  },
  actions: {
    setUser(user: User) {
      this.currentUser = user;
    },
    setProfile(profile: Profile | null) {
      this.userProfile = profile;
    },
    updateProfile(profile: Profile) {
      this.userProfile = profile;
    },
    setTokens(tokens: AuthTokens | null) {
      this.tokens = tokens;
    },
    init() {
      if (!this.currentUser) {
        this.currentUser = { ...guestUser };
      }
    },
    reset() {
      this.currentUser = null;
      this.userProfile = null;
      this.tokens = null;
      this.init();
    },
    logout() {
      this.reset();
      router.push('/');
      const snackbarStore = useSnackbarStore();
      snackbarStore.showSnackbar('Erfolgreich abgemeldet!', 'success');
    },
    hasPermission(role: Role, permission: Permission) {
      return checkPermission(role, permission);
    }
  }
});

export function filterMenuByRole<T extends { roles?: Role[] }>(menu: readonly T[], role: Role) {
  return menu.filter(item => {
    // Visible by default when no roles are specified
    if (!item.roles || item.roles.length === 0) return true;

    // Special-case Guest: items restricted to guests should only be visible to guests
    if (item.roles.includes(Role.Guest)) {
      return role === Role.Guest;
    }

    // Role.Any means visible to everyone
    if (item.roles.includes(Role.Any)) {
      return true;
    }

    // For all other roles use minimum-role semantics
    return item.roles.some(r => roleAtLeast(role, r));
  });
}

export { rolePermissions } from '@/data/mock-data';
