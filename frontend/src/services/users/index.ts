import type { Profile } from '@/types'
import { getAuthHeaders } from '@/services/api'

export async function fetchProfile(userId: string): Promise<Profile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `profile-${userId}`,
        userId,
        username: `user-${userId}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${Number.parseInt(userId) + 10}`,
        bio: `This is a mock bio for user ${userId}.`,
        status: Number.parseInt(userId) % 2 === 0 ? 'online' : 'offline',
        lastSeen:
          Number.parseInt(userId) % 2 === 0 ? '' : `${(Number.parseInt(userId) % 5) + 1} hours ago`,
      })
    }, 1000)
  })
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const headers = getAuthHeaders()
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating profile with headers:', headers)
      resolve(profile)
    }, 1000)
  })
}
