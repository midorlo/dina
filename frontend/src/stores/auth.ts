import type { Permission } from '@/data/mock-data'
import type { AuthTokens, Profile, User } from '@/types'
import { defineStore } from 'pinia'
import { guestUser, Role, roleHierarchy, rolePermissions } from '@/data/mock-data'
import router from '@/router'

export function hasRole(role: Role, required: Role) {
  if (required === Role.Any) return role !== Role.Banned
  return roleHierarchy[role]?.includes(required) ?? false
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    userProfile: null as Profile | null,
    tokens: null as AuthTokens | null,
  }),
  persist: true,
  actions: {
    setUser(user: User) {
      this.currentUser = user
    },
    setProfile(profile: Profile | null) {
      this.userProfile = profile
    },
    updateProfile(profile: Profile) {
      this.userProfile = profile
    },
    setTokens(tokens: AuthTokens | null) {
      this.tokens = tokens
    },
    init() {
      if (!this.currentUser) {
        this.currentUser = { ...guestUser }
      }
    },
    reset() {
      this.currentUser = null
      this.userProfile = null
      this.tokens = null
      this.init()
    },
    logout() {
      this.reset()
      router.push('/login')
    },
    hasPermission(role: Role, permission: Permission) {
      return rolePermissions[role]?.includes(permission) ?? false
    },
  },
})

export function filterMenuByRole<T extends { roles?: Role[] }>(menu: T[], role: Role) {
  return menu.filter((item) => !item.roles || item.roles.some((r) => hasRole(role, r)))
}

export { rolePermissions } from '@/data/mock-data'
