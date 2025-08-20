import { defineStore } from 'pinia'
import { type AuthTokens, Permission, type Profile, Role, type User } from '@/types'

const rolePermissions: Record<Role, Permission[]> = {
  [Role.Guest]: [],
  [Role.User]: [Permission.ViewDashboard],
  [Role.Moderator]: [Permission.ViewDashboard],
  [Role.Administrator]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Developer]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Banned]: [],
}

const roleHierarchy: Record<Role, Role[]> = {
  [Role.Developer]: [Role.Developer, Role.Administrator, Role.Moderator, Role.User],
  [Role.Administrator]: [Role.Administrator, Role.Moderator, Role.User],
  [Role.Moderator]: [Role.Moderator, Role.User],
  [Role.User]: [Role.User],
  [Role.Guest]: [Role.Guest],
  [Role.Banned]: [],
}

export function hasRole(role: Role, required: Role) {
  return roleHierarchy[role]?.includes(required) ?? false
}

const guestUser: User = {
  id: 'guest',
  email: '',
  name: 'Guest',
  role: Role.Guest,
  username: 'guest',
  avatarUrl: '',
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
    hasPermission(role: Role, permission: Permission) {
      return rolePermissions[role]?.includes(permission) ?? false
    },
  },
})

export function filterMenuByRole<T extends { roles?: Role[] }>(menu: T[], role: Role) {
  return menu.filter((item) => !item.roles || item.roles.some((r) => hasRole(role, r)))
}

export { rolePermissions }
