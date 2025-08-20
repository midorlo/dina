import type { AuthTokens, LoginResponse, Profile, User } from '@/types'
import { Role } from ' @/types'
import { apiFetch } from ' @/services/api'
import { useMocks } from ' @/services/mock'

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!useMocks) {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return res.json()
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users: User[] = [
        {
          id: 'user-1',
          email: 'user@example.com',
          name: 'Regular User',
          role: Role.User,
          username: 'regular_user',
          avatarUrl: 'https://i.pravatar.cc/150?img=1',
        },
        {
          id: 'user-2',
          email: 'moderator@example.com',
          name: 'Moderator User',
          role: Role.Moderator,
          username: 'moderator_user',
          avatarUrl: 'https://i.pravatar.cc/150?img=2',
        },
        {
          id: 'user-3',
          email: 'admin@example.com',
          name: 'Admin User',
          role: Role.Administrator,
          username: 'admin_user',
          avatarUrl: 'https://i.pravatar.cc/150?img=3',
        },
        {
          id: 'user-4',
          email: 'dev@example.com',
          name: 'Developer User',
          role: Role.Developer,
          username: 'dev_user',
          avatarUrl: 'https://i.pravatar.cc/150?img=4',
        },
        {
          id: 'user-5',
          email: 'banned@example.com',
          name: 'Banned User',
          role: Role.Banned,
          username: 'banned_user',
          avatarUrl: 'https://i.pravatar.cc/150?img=5',
        },
      ]

      const foundUser = users.find((u) => u.email === email)
      if (foundUser && password === 'password') {
        if (foundUser.role === Role.Banned) {
          reject(new Error('User is banned'))
          return
        }
        const tokens: AuthTokens = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
          refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        }
        const profile: Profile = {
          id: `profile-${foundUser.id}`,
          userId: foundUser.id,
          username: foundUser.username,
          avatarUrl: foundUser.avatarUrl,
        }
        resolve({ user: foundUser, tokens, profile })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 1000)
  })
}
