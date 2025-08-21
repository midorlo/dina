import type { Profile } from '@/types'
import { mockUsers } from '@/data/mock-data.ts'
import { apiFetch, getAuthHeaders } from '@/services/api'
import { delay, useMocks } from '@/utils/mock.ts'

export async function fetchProfile(userId: string): Promise<Profile> {
  if (!useMocks) {
    const res = await apiFetch(`/api/users/${userId}/profile`)
    return res.json()
  }
  const found = mockUsers.find((u) => u.user.id === userId)
  if (!found) {
    throw new Error('Profile not found')
  }
  return delay(found.profile, 1000)
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
