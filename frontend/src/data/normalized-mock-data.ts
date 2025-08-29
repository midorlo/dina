import type { Profile } from '@/types';
import { Role } from '@/types/auth';

// =================================================================
// NORMALIZED MOCK DATABASE
// =================================================================
// This structure mimics a relational database.
// - Each const (e.g., `users`) represents a table.
// - Rows are objects in the array.
// - Relationships are handled by IDs (e.g., `authorId`).
//
// This is the single source of truth for all mock data.
// Services will query and "join" this data to create the models
// needed by the UI components.
// =================================================================

function avatar(n: number) {
  return `https://i.pravatar.cc/150?img=${n}`;
}
function unsplash(id: string, w = 2070) {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;
}

// --- Tables ---

export const users = [
  { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', role: Role.User, avatarUrl: avatar(1) },
  { id: 'u2', name: 'Jane Smith', email: 'jane.smith@example.com', role: Role.Moderator, avatarUrl: avatar(2) },
  { id: 'u3', name: 'Peter Jones', email: 'peter.jones@example.com', role: Role.Administrator, avatarUrl: avatar(3) },
  { id: 'u4', name: 'Mary Williams', email: 'mary.williams@example.com', role: Role.Developer, avatarUrl: avatar(4) },
  { id: 'u5', name: 'David Brown', email: 'david.brown@example.com', role: Role.Banned, avatarUrl: avatar(5) },
  // Users from old conversations mock
  { id: 'u6', name: 'Alice', email: 'alice@example.com', role: Role.User, avatarUrl: avatar(6) },
  { id: 'u7', name: 'Bob', email: 'bob@example.com', role: Role.User, avatarUrl: avatar(7) },
  { id: 'u8', name: 'Charlie', email: 'charlie@example.com', role: Role.User, avatarUrl: avatar(8) },
  { id: 'u9', name: 'Eve', email: 'eve@example.com', role: Role.User, avatarUrl: avatar(9) }
];

export const profiles: Profile[] = [
  {
    id: 'pf1',
    userId: 'u1',
    username: 'john.doe',
    bio: 'I am a software developer from New York.',
    status: 'online',
    lastSeen: ''
  },
  {
    id: 'pf2',
    userId: 'u2',
    username: 'jane.smith',
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: '2025-08-20T14:00:00Z'
  },
  {
    id: 'pf3',
    userId: 'u3',
    username: 'peter.jones',
    bio: 'I am a software developer from New York.',
    status: 'online',
    lastSeen: ''
  },
  {
    id: 'pf4',
    userId: 'u4',
    username: 'mary.williams',
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: '2025-08-21T18:30:00Z'
  },
  {
    id: 'pf5',
    userId: 'u5',
    username: 'david.brown',
    bio: 'I am a full-stack developer from Tokyo.',
    status: 'online',
    lastSeen: ''
  }
];

export const blogs = [
  {
    id: 'b1',
    authorId: 'u1',
    name: 'Johns Gedanken',
    description: 'Ein Einblick...',
    createdAt: '2024-05-12T10:00:00Z'
  },
  {
    id: 'b2',
    authorId: 'u2',
    name: 'Janes Abenteuer',
    description: 'Atemberaubende...',
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: 'b3',
    authorId: 'u3',
    name: 'Peters Küche',
    description: 'Einfache Rezepte...',
    createdAt: '2024-02-22T16:00:00Z'
  },
  {
    id: 'b4',
    authorId: 'u4',
    name: 'Marys grüner Daumen',
    description: 'Wie du auch ohne...',
    createdAt: '2024-03-12T11:00:00Z'
  },
  {
    id: 'b5',
    authorId: 'u5',
    name: 'Davids Sternenbilder',
    description: 'Die Sterne...',
    createdAt: '2024-04-02T20:00:00Z'
  }
];

export const posts = [
  {
    id: 'p101',
    blogId: 'b1',
    title: 'Mein Weg zum Minimalismus',
    excerpt: 'Es begann alles mit einer einfachen Frage...',
    category: 'Lebensstil',
    imageUrl: unsplash('1484981138541-3d074aa97716'),
    content: ['Es begann alles mit einer einfachen Frage: Brauche ich das wirklich?...'],
    createdAt: '2025-08-15T09:00:00Z'
  },
  {
    id: 'p102',
    blogId: 'b1',
    title: 'Die 5-Minuten-Regel für mehr Ordnung',
    excerpt: 'Ein einfacher Trick...',
    category: 'Organisation',
    imageUrl: unsplash('1529070538774-1843cb3265df'),
    content: ['Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten...'],
    createdAt: '2025-07-02T14:00:00Z'
  }
  // ... other posts would go here
];

export const conversations = [
  { id: 'c1', participantIds: ['u1', 'u6'] }, // John & Alice
  { id: 'c2', participantIds: ['u1', 'u7'] }, // John & Bob
  { id: 'c3', participantIds: ['u1', 'u8'] }, // John & Charlie
  { id: 'c4', participantIds: ['u1', 'u9'] } // John & Eve
];

export const messages = [
  // Conversation c1 (John & Alice)
  { id: 'm1', conversationId: 'c1', senderId: 'u6', text: 'Hi there!', createdAt: '2025-08-29T10:28:00Z', read: true },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'u1',
    text: 'Hey, how are you?',
    createdAt: '2025-08-29T10:30:00Z',
    read: true
  },
  {
    id: 'm3',
    conversationId: 'c1',
    senderId: 'u6',
    text: "I'm doing great, thanks! How about you?",
    createdAt: '2025-08-29T10:32:00Z',
    read: false
  },
  {
    id: 'm4',
    conversationId: 'c1',
    senderId: 'u1',
    text: 'All good here. Just busy with work.',
    createdAt: '2025-08-29T10:35:00Z',
    read: false
  },
  {
    id: 'm5',
    conversationId: 'c1',
    senderId: 'u6',
    text: 'Same here! We should catch up soon.',
    createdAt: '2025-08-29T10:40:00Z',
    read: false
  },

  // Conversation c2 (John & Bob)
  {
    id: 'm6',
    conversationId: 'c2',
    senderId: 'u7',
    text: 'Are you free tomorrow for the project meeting?',
    createdAt: '2025-08-28T15:00:00Z',
    read: true
  },
  {
    id: 'm7',
    conversationId: 'c2',
    senderId: 'u1',
    text: 'Yes, I am. What time?',
    createdAt: '2025-08-28T15:05:00Z',
    read: true
  }

  // ... other messages
];

export const photos = [
  { id: 'ph1', ownerId: 'u1', src: 'https://picsum.photos/500/300?image=15', aspectRatio: 500 / 300 },
  { id: 'ph2', ownerId: 'u1', src: 'https://picsum.photos/400/600?image=25', aspectRatio: 400 / 600 },
  { id: 'ph3', ownerId: 'u2', src: 'https://picsum.photos/600/400?image=35', aspectRatio: 600 / 400 }
];

export const notifications = [
  // For: u2 (Jane Smith), from u1 (John Doe)
  {
    id: 'n1',
    recipientId: 'u2',
    actorId: 'u1',
    type: 'NEW_FOLLOWER',
    subject: { type: 'USER', id: 'u1' },
    createdAt: '2025-08-29T12:20:00Z',
    read: false
  },
  // For: u1 (John Doe), from u2 (Jane Smith)
  {
    id: 'n2',
    recipientId: 'u1',
    actorId: 'u2',
    type: 'PHOTO_LIKED',
    subject: { type: 'PHOTO', id: 'ph1' },
    createdAt: '2025-08-29T11:30:00Z',
    read: true
  },
  // For: u1 (John Doe), from u3 (Peter Jones)
  {
    id: 'n3',
    recipientId: 'u1',
    actorId: 'u3',
    type: 'POST_COMMENT',
    subject: { type: 'POST', id: 'p101' },
    createdAt: '2025-08-29T10:00:00Z',
    read: false
  },
  // For: u4 (Mary Williams), system notification
  {
    id: 'n4',
    recipientId: 'u4',
    actorId: null,
    type: 'SERVER_UPDATE',
    subject: null,
    createdAt: '2025-08-28T16:00:00Z',
    read: false
  }
];

// =================================================================
// Data Access Helpers (Simulating a Backend/ORM)
// =================================================================

export const db = {
  users,
  profiles,
  blogs,
  posts,
  conversations,
  messages,
  photos,
  notifications
};
