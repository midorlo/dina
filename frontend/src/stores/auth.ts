import { defineStore } from 'pinia'
import { type AuthTokens, Permission, type Profile, Role, type User } from '@/types'

const rolePermissions: Record<Role, Permission[]> = {
  [Role.Guest]: [],
  [Role.User]: [Permission.ViewDashboard],
  [Role.Admin]: [Permission.ViewDashboard, Permission.ManageUsers],
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    userProfile: null as Profile | null,
    tokens: null as AuthTokens | null,
  }),
  persist: true,
  actions: {
    setUser(user: User | null) {
      this.currentUser = user
    },
    setProfile(profile: Profile | null) {
      this.userProfile = profile
    },
    setTokens(tokens: AuthTokens | null) {
      this.tokens = tokens
    },
    reset() {
      this.$reset()
    },
    hasPermission(role: Role, permission: Permission) {
      return rolePermissions[role]?.includes(permission) ?? false
    },
  },
})

export function filterMenuByRole<T extends { roles?: Role[] }>(menu: T[], role: Role) {
  return menu.filter((item) => !item.roles || item.roles.includes(role))
}

export { rolePermissions }
