import { type Profile, Role, type User } from '@/types'

export interface MockUser {
  user: User
  profile: Profile
}

export const mockUsers: MockUser[] = [
  {
    user: {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: Role.User,
      username: 'john.doe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    profile: {
      id: '1',
      userId: '1',
      username: 'john.doe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      bio: 'I am a software developer from New York.',
      status: 'online',
      lastSeen: '',
    },
  },
  {
    user: {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: Role.Moderator,
      username: 'jane.smith',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
    profile: {
      id: '2',
      userId: '2',
      username: 'jane.smith',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      bio: 'I am a data scientist from Berlin.',
      status: 'offline',
      lastSeen: '2 hours ago',
    },
  },
  {
    user: {
      id: '3',
      email: 'peter.jones@example.com',
      name: 'Peter Jones',
      role: Role.Administrator,
      username: 'peter.jones',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    profile: {
      id: '3',
      userId: '3',
      username: 'peter.jones',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      bio: 'I am a software developer from New York.',
      status: 'online',
      lastSeen: '',
    },
  },
  {
    user: {
      id: '4',
      email: 'mary.williams@example.com',
      name: 'Mary Williams',
      role: Role.Developer,
      username: 'mary.williams',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
    },
    profile: {
      id: '4',
      userId: '4',
      username: 'mary.williams',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      bio: 'I am a data scientist from Berlin.',
      status: 'offline',
      lastSeen: 'yesterday',
    },
  },
  {
    user: {
      id: '5',
      email: 'david.brown@example.com',
      name: 'David Brown',
      role: Role.Banned,
      username: 'david.brown',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    profile: {
      id: '5',
      userId: '5',
      username: 'david.brown',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      bio: 'I am a full-stack developer from Tokyo.',
      status: 'online',
      lastSeen: '',
    },
  },
]
