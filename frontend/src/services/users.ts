import type { Profile } from '@/types'
import { apiFetch, getAuthHeaders } from ' @/services/api'
import { delay, useMocks } from ' @/services/mock'

export async function fetchProfile(userId: string): Promise<Profile> {
  if (!useMocks) {
    const res = await apiFetch(`/api/users/${userId}/profile`)
    return res.json()
  }
  const profile: Profile = {
    id: `profile-${userId}`,
    userId,
    username: `user-${userId}`,
    avatarUrl: `https://i.pravatar.cc/150?img=${Number.parseInt(userId) + 10}`,
    bio: `This is a mock bio for user ${userId}.`,
    location: 'Mock City',
    status: Number.parseInt(userId) % 2 === 0 ? 'online' : 'offline',
    lastSeen:
      Number.parseInt(userId) % 2 === 0 ? '' : `${(Number.parseInt(userId) % 5) + 1} hours ago`,
  }
  return delay(profile, 1000)
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const headers = getAuthHeaders()
  if (!useMocks) {
    const res = await apiFetch(`/api/profiles/${profile.id}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    return res.json()
  }
  console.log('Updating profile with headers:', headers)
  return delay(profile, 1000)
}
