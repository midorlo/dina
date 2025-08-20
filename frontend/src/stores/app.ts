import type { Profile, User } from '@/types'

// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentUser: null as User | null,
    userProfile: null as Profile | null,
  }),
})
