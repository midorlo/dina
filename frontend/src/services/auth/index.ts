import type { User } from '@/types'
import { Role } from '@/types'

export async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users: User[] = [
        { id: 'user-1', email: 'user@example.com', name: 'Regular User', role: Role.User },
        { id: 'user-2', email: 'admin@example.com', name: 'Admin User', role: Role.Admin },
        { id: 'user-3', email: 'guest@example.com', name: 'Guest User', role: Role.Guest },
      ]

      const foundUser = users.find((u) => u.email === email && password === 'password')
      if (foundUser) {
        resolve(foundUser)
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 1000)
  })
}
