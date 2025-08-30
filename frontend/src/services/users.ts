import type { Profile } from '@/types';
import type { User } from '@/types/auth';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

// --- MOCK IMPLEMENTATIONS ---
const mockFetchUsers = () => delay([...db.users], 150);
function mockFetchUser(id: string) {
  return delay(
    db.users.find(u => u.id === id),
    150
  );
}

// --- API IMPLEMENTATIONS ---
const apiFetchUsers = () => apiFetch('/api/v1/users').then(res => res.json());
const apiFetchUser = (id: string) => apiFetch(`/api/v1/users/${id}`).then(res => res.json());

// --- COMPOSABLES ---
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: useMocks ? mockFetchUsers : apiFetchUsers
  });
}

export function useUser(id: string) {
  return useQuery<User | undefined>({
    queryKey: ['users', id],
    queryFn: () => (useMocks ? mockFetchUser(id) : apiFetchUser(id)),
    enabled: !!id // Only run if id is provided
  });
}

// Lightweight helpers used by profile edit page
export async function fetchProfile(userId: string): Promise<Profile> {
  // assemble profile similar to services/profiles
  const profileData = db.profiles.find(p => p.userId === userId);
  if (!profileData) throw new Error('Profile not found');
  const user = db.users.find(u => u.id === profileData.userId);
  if (!user) throw new Error('User not found');
  return {
    id: profileData.id,
    userId: user.id,
    username: user.name,
    avatarUrl: user.avatarUrl,
    bio: profileData.bio,
    status: profileData.status,
    lastSeen: profileData.lastSeen
  };
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  // Mock: return the provided profile without mutating the mock DB
  return delay(profile, 150);
}
