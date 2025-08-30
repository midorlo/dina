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

function mockFetchProfile(profileId: string) {
  const profileData = db.profiles.find(p => p.id === profileId);
  if (!profileData) return delay(undefined, 200);
  return delay(assembleProfile(profileData), 200);
}

// --- API IMPLEMENTATIONS ---

const apiFetchProfiles = () => apiFetch('/api/v1/profiles').then(res => res.json());
const apiFetchProfile = (profileId: string) => apiFetch(`/api/v1/profiles/${profileId}`).then(res => res.json());

// --- COMPOSABLES ---

export function useProfiles() {
  return useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: useMocks ? mockFetchProfiles : apiFetchProfiles
  });
}

export function useProfile(profileId: string) {
  return useQuery<Profile | undefined>({
    queryKey: ['profiles', profileId],
    queryFn: () => (useMocks ? mockFetchProfile(profileId) : apiFetchProfile(profileId)),
    enabled: !!profileId
  });
}
