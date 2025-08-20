import type { Profile, User } from '@/types'
import { Role } from '@/types'

export const apiService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users: User[] = [
          { id: 'user-1', email: 'user@example.com', name: 'Regular User', role: Role.User },
          {
            id: 'user-2',
            email: 'admin@example.com',
            name: 'Admin User',
            role: Role.Administrator,
          },
          {
            id: 'user-3',
            email: 'moderator@example.com',
            name: 'Moderator User',
            role: Role.Moderator,
          },
          { id: 'user-4', email: 'guest@example.com', name: 'Guest User', role: Role.Guest },
        ]

        const foundUser = users.find((u) => u.email === email && password === 'password') // Simple password check

        if (foundUser) {
          resolve(foundUser)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  },

  async fetchProfile(userId: string): Promise<Profile> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a consistent mock profile for demonstration
        resolve({
          id: `profile-${userId}`,
          userId,
          username: `user-${userId}`,
          avatarUrl: `https://i.pravatar.cc/150?img=${Number.parseInt(userId) + 10}`,
          bio: `This is a mock bio for user ${userId}.`,
          status: Number.parseInt(userId) % 2 === 0 ? 'online' : 'offline',
          lastSeen:
            Number.parseInt(userId) % 2 === 0
              ? ''
              : `${(Number.parseInt(userId) % 5) + 1} hours ago`,
        })
      }, 1000)
    })
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating profile:', profile)
        resolve(profile) // Return the updated profile
      }, 1000)
    })
  },
}
