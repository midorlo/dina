import type { Profile, User } from '@/types'
// Utilities
import { defineStore } from 'pinia'

import { Role } from '@/types'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentUser: {
      id: 'user-1',
      email: 'mock@example.com',
      name: 'Mock User',
      role: Role.User,
    } as User | null,
    userProfile: null as Profile | null,
  }),
})
