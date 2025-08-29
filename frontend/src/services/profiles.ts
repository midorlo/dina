import type { Profile } from '@/types';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

// =================================================================
// Data Assembly Helpers
// =================================================================

function assembleProfile(profileData: (typeof db.profiles)[0]): Profile | undefined {
  const user = db.users.find(u => u.id === profileData.userId);
  if (!user) return undefined;

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

// =================================================================
// Vue Query Composables
// =================================================================

// --- MOCK IMPLEMENTATIONS ---

function mockFetchProfiles() {
  const profiles = db.profiles.map(profile => assembleProfile(profile)).filter(p => p !== undefined) as Profile[];
  return delay(profiles, 200);
}

function mockFetchProfile(userId: string) {
  const profileData = db.profiles.find(p => p.userId === userId);
  if (!profileData) return delay(undefined, 200);
  return delay(assembleProfile(profileData), 200);
}

// --- API IMPLEMENTATIONS ---

const apiFetchProfiles = () => apiFetch('/api/profiles').then(res => res.json());
const apiFetchProfile = (userId: string) => apiFetch(`/api/profiles/${userId}`).then(res => res.json());

// --- COMPOSABLES ---

export function useProfiles() {
  return useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: useMocks ? mockFetchProfiles : apiFetchProfiles
  });
}

export function useProfile(userId: string) {
  return useQuery<Profile | undefined>({
    queryKey: ['profiles', userId],
    queryFn: () => (useMocks ? mockFetchProfile(userId) : apiFetchProfile(userId)),
    enabled: !!userId
  });
}
