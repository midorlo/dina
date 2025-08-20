import type { Profile } from '@/types'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/services/mock'

const profiles: Profile[] = [
  {
    id: '1',
    userId: '1',
    username: 'john.doe',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'I am a software developer from New York.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '2',
    userId: '2',
    username: 'jane.smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: '2 hours ago',
  },
  {
    id: '3',
    userId: '3',
    username: 'peter.jones',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    bio: 'I am a software developer from New York.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '4',
    userId: '4',
    username: 'mary.williams',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: 'yesterday',
  },
  {
    id: '5',
    userId: '5',
    username: 'david.brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    bio: 'I am a full-stack developer from Tokyo.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '6',
    userId: '6',
    username: 'susan.davis',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    bio: 'I am a project manager from Sydney.',
    status: 'offline',
    lastSeen: '30 minutes ago',
  },
  {
    id: '7',
    userId: '7',
    username: 'michael.miller',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    bio: 'I am a QA engineer from Toronto.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '8',
    userId: '8',
    username: 'linda.wilson',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    bio: 'I am a business analyst from Singapore.',
    status: 'offline',
    lastSeen: '1 hour ago',
  },
  {
    id: '9',
    userId: '9',
    username: 'robert.moore',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    bio: 'I am a DevOps engineer from Mumbai.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '10',
    userId: '10',
    username: 'patricia.taylor',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    bio: 'I am a technical writer from Dublin.',
    status: 'offline',
    lastSeen: 'today',
  },
  {
    id: '11',
    userId: '11',
    username: 'james.anderson',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    bio: 'I am a mobile developer from Seoul.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '12',
    userId: '12',
    username: 'barbara.thomas',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    bio: 'I am a database administrator from Moscow.',
    status: 'offline',
    lastSeen: '5 hours ago',
  },
  {
    id: '13',
    userId: '13',
    username: 'william.jackson',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    bio: 'I am a network engineer from Beijing.',
    status: 'online',
    lastSeen: '',
  },
  {
    id: '14',
    userId: '14',
    username: 'elizabeth.white',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    bio: 'I am a security analyst from Cairo.',
    status: 'offline',
    lastSeen: '2 days ago',
  },
  {
    id: '15',
    userId: '15',
    username: 'richard.harris',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    bio: 'I am a cloud architect from Rio de Janeiro.',
    status: 'online',
    lastSeen: '',
  },
]

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
