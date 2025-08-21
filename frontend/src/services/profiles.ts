import type { Profile } from '@/types'
import { mockUsers } from '@/data/mock-data.ts'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/utils/mock.ts'

const profiles = mockUsers.map(({ profile }) => profile)

export async function fetchProfiles(): Promise<Profile[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/profiles')
    return res.json()
  }
  return delay(profiles, 500)
}

export async function fetchProfile(id: string): Promise<Profile | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/profiles/${id}`)
    return res.json()
  }
  return delay(
    profiles.find((p) => p.id === id),
    500
  )
}
