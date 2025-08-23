import type { Blog, Conversation, GalleryItem, NotificationItem, Post, PostItem, Profile, User } from '@/types';
import type { MenuItem } from '@/types/menuData.ts';
import logo from '@/assets/logo.svg';

/** ---------- Roles & Permissions ---------- */

export enum Permission {
  ViewDashboard = 'view_dashboard',
  ManageUsers = 'manage_users'
}

export enum Role {
  Any = 'any',
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
  Administrator = 'administrator',
  Developer = 'developer',
  Banned = 'banned'
}

/** Rollenrang für verlässliche Vergleiche (höher = mehr Rechte) */
export const roleRank: Readonly<Record<Role, number>> = {
  [Role.Banned]: -1,
  [Role.Guest]: 0,
  [Role.User]: 1,
  [Role.Moderator]: 2,
  [Role.Administrator]: 3,
  [Role.Developer]: 4,
  [Role.Any]: 0 // neutral/default
} as const;

export const roleAtLeast = (role: Role, required: Role): boolean => roleRank[role] >= roleRank[required];

/** Basis-Permissions, ggf. ergänzt über roleAtLeast(...) Checks in Guards */
export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.Any]: [],
  [Role.Guest]: [],
  [Role.User]: [Permission.ViewDashboard],
  [Role.Moderator]: [Permission.ViewDashboard],
  [Role.Administrator]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Developer]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Banned]: []
} as const;

export const hasPermission = (role: Role, permission: Permission): boolean =>
  rolePermissions[role].includes(permission);

/** ---------- Helpers (Mock utils) ---------- */

const avatar = (n: number) => `https://i.pravatar.cc/150?img=${n}`;
const unsplash = (id: string, w = 2070) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;

/** ISO-Dateien beibehalten – UI formatiert. */
type ISODate = `${number}-${number}-${number}`;

/** ---------- Users & Profiles ---------- */

export interface MockUser {
  user: User;
  profile: Profile;
}

/** Minimale, konsistente Erstellung eines Users inkl. Profil */
function createMockUser(params: {
  id: string;
  email: string;
  name: string;
  role: Role;
  username: string;
  avatarIndex: number;
  bio: string;
  status: 'online' | 'offline';
  lastSeen?: string; // ISO oder menschenlesbar – Anzeige entscheidet
}): MockUser {
  const { id, email, name, role, username, avatarIndex, bio, status, lastSeen = '' } = params;
  const avatarUrl = avatar(avatarIndex);
  const user: User = { id, email, name, role, username, avatarUrl };
  const profile: Profile = {
    id,
    userId: id,
    username,
    avatarUrl,
    bio,
    status,
    lastSeen
  };
  return { user, profile };
}

export const mockUsers: Readonly<MockUser[]> = [
  createMockUser({
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: Role.User,
    username: 'john.doe',
    avatarIndex: 1,
    bio: 'I am a software developer from New York.',
    status: 'online'
  }),
  createMockUser({
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: Role.Moderator,
    username: 'jane.smith',
    avatarIndex: 2,
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: '2025-08-20' // ISO bevorzugt
  }),
  createMockUser({
    id: '3',
    email: 'peter.jones@example.com',
    name: 'Peter Jones',
    role: Role.Administrator,
    username: 'peter.jones',
    avatarIndex: 3,
    bio: 'I am a software developer from New York.',
    status: 'online'
  }),
  createMockUser({
    id: '4',
    email: 'mary.williams@example.com',
    name: 'Mary Williams',
    role: Role.Developer,
    username: 'mary.williams',
    avatarIndex: 4,
    bio: 'I am a data scientist from Berlin.',
    status: 'offline',
    lastSeen: '2025-08-21'
  }),
  createMockUser({
    id: '5',
    email: 'david.brown@example.com',
    name: 'David Brown',
    role: Role.Banned,
    username: 'david.brown',
    avatarIndex: 5,
    bio: 'I am a full-stack developer from Tokyo.',
    status: 'online'
  })
] as const;

/** schnelle Lookups */
export const usersById: Readonly<Record<string, User>> = Object.fromEntries(
  mockUsers.map(({ user }) => [user.id, user])
) as Record<string, User>;

export const profilesByUserId: Readonly<Record<string, Profile>> = Object.fromEntries(
  mockUsers.map(({ profile }) => [profile.userId, profile])
) as Record<string, Profile>;

export const guestUser: User = {
  id: 'guest',
  email: '',
  name: 'Guest',
  role: Role.Guest,
  username: 'guest',
  avatarUrl: ''
};

/** convenience getters */
export const getUserById = (id: string): User | undefined => usersById[id];
export const getProfileByUserId = (userId: string): Profile | undefined => profilesByUserId[userId];

/** ---------- Blogs & Posts ---------- */

const u = (username: string) => mockUsers.find(m => m.user.username === username)?.user;

export const mockBlogsData: Readonly<Blog[]> = [
  {
    id: '1',
    name: 'Johns Gedanken',
    authorHandle: 'john.doe',
    authorAvatarUrl: u('john.doe')?.avatarUrl,
    description: 'Ein Einblick in einen aufgeräumten Lebensstil und wie er zu mehr Klarheit führen kann.',
    postCount: 3,
    createdAt: '2024-05-12' satisfies ISODate
  },
  {
    id: '2',
    name: 'Janes Abenteuer',
    authorHandle: 'jane.smith',
    authorAvatarUrl: u('jane.smith')?.avatarUrl,
    description: 'Atemberaubende Landschaften und unvergessliche Momente auf meinen Reisen durch die Welt.',
    postCount: 2,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Peters Küche',
    authorHandle: 'peter.jones',
    authorAvatarUrl: u('peter.jones')?.avatarUrl,
    description: 'Einfache Rezepte, die immer gelingen. Entdecke die Freude am Kochen, Schritt für Schritt.',
    postCount: 1,
    createdAt: '2024-02-22'
  },
  {
    id: '4',
    name: 'Marys grüner Daumen',
    authorHandle: 'mary.williams',
    authorAvatarUrl: u('mary.williams')?.avatarUrl,
    description: 'Wie du auch ohne Garten frisches Gemüse und Kräuter anbauen kannst.',
    postCount: 1,
    createdAt: '2024-03-12'
  },
  {
    id: '5',
    name: 'Davids Sternenbilder',
    authorHandle: 'david.brown',
    authorAvatarUrl: u('david.brown')?.avatarUrl,
    description: 'Die Sterne fotografieren: Welche Ausrüstung du brauchst und die besten Tipps für den Anfang.',
    postCount: 1,
    createdAt: '2024-04-02'
  }
] as const;

export const mockBlogPostsData: Readonly<Record<string, readonly PostItem[]>> = {
  '1': [
    {
      id: 101,
      title: 'Mein Weg zum Minimalismus',
      createdAt: '2025-08-15',
      excerpt:
        'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit.'
    },
    {
      id: 102,
      title: 'Die 5-Minuten-Regel für mehr Ordnung',
      createdAt: '2025-07-02',
      excerpt:
        'Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten, ohne großen Aufwand.'
    },
    {
      id: 103,
      title: 'Digital Detox: Erfahrungen & Tipps',
      createdAt: '2025-06-21',
      excerpt: 'Eine Woche ohne Smartphone. Was ich gelernt habe und wie auch du eine digitale Auszeit schaffen kannst.'
    }
  ],
  '2': [
    {
      id: 201,
      title: 'Wanderung zur Zugspitze',
      createdAt: '2025-08-10',
      excerpt: 'Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.'
    },
    {
      id: 202,
      title: 'Mit dem Rucksack durch Vietnam',
      createdAt: '2025-03-15',
      excerpt:
        'Von lauten Städten bis zu stillen Reisfeldern. Eine Reise voller Kontraste und unvergesslicher Begegnungen.'
    }
  ],
  '3': [
    {
      id: 301,
      title: 'Mein Lieblingsrezept',
      createdAt: '2025-05-05',
      excerpt: 'Ein einfaches Gericht, das jeder zuhause nachkochen kann.'
    }
  ],
  '4': [
    {
      id: 401,
      title: 'Urban Gardening für Anfänger',
      createdAt: '2025-04-18',
      excerpt: 'Wie du auch auf dem Balkon frische Kräuter ziehen kannst.'
    }
  ],
  '5': [
    {
      id: 501,
      title: 'Die Milchstraße fotografieren',
      createdAt: '2025-06-11',
      excerpt: 'Tipps, wie du die Milchstraße mit einfacher Ausrüstung festhältst.'
    }
  ]
} as const;

/** Post-Details keyed "blogId:postId" */
export const blogPostsDetails: Readonly<Record<string, Post>> = {
  '1:101': {
    id: '101',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Mein Weg zum Minimalismus',
    author: u('john.doe')?.name ?? '',
    authorAvatarUrl: u('john.doe')?.avatarUrl,
    date: '2025-08-15',
    category: 'Lebensstil',
    imageUrl: unsplash('1484981138541-3d074aa97716'),
    content: [
      'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit.',
      'Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.'
    ]
  },
  '1:102': {
    id: '102',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Die 5-Minuten-Regel für mehr Ordnung',
    author: u('john.doe')?.name ?? '',
    authorAvatarUrl: u('john.doe')?.avatarUrl,
    date: '2025-07-02',
    category: 'Organisation',
    imageUrl: unsplash('1529070538774-1843cb3265df'),
    content: [
      'Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten, ohne großen Aufwand.'
    ]
  },
  '1:103': {
    id: '103',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Digital Detox: Erfahrungen & Tipps',
    author: u('john.doe')?.name ?? '',
    authorAvatarUrl: u('john.doe')?.avatarUrl,
    date: '2025-06-21',
    category: 'Digitales',
    imageUrl: unsplash('1518770660439-4636190af475'),
    content: ['Eine Woche ohne Smartphone. Was ich gelernt habe und wie auch du eine digitale Auszeit schaffen kannst.']
  },
  '2:201': {
    id: '201',
    blogId: '2',
    blogName: 'Janes Abenteuer',
    title: 'Wanderung zur Zugspitze',
    author: u('jane.smith')?.name ?? '',
    authorAvatarUrl: u('jane.smith')?.avatarUrl,
    date: '2025-08-10',
    category: 'Reisen',
    imageUrl: unsplash('1506905925346-21bda4d32df4'),
    content: ['Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.']
  },
  '2:202': {
    id: '202',
    blogId: '2',
    blogName: 'Janes Abenteuer',
    title: 'Mit dem Rucksack durch Vietnam',
    author: u('jane.smith')?.name ?? '',
    authorAvatarUrl: u('jane.smith')?.avatarUrl,
    date: '2025-03-15',
    category: 'Reisen',
    imageUrl: unsplash('1506744038136-46273834b3fb'),
    content: [
      'Von lauten Städten bis zu stillen Reisfeldern. Eine Reise voller Kontraste und unvergesslicher Begegnungen.'
    ]
  },
  '3:301': {
    id: '301',
    blogId: '3',
    blogName: 'Peters Küche',
    title: 'Mein Lieblingsrezept',
    author: u('peter.jones')?.name ?? '',
    authorAvatarUrl: u('peter.jones')?.avatarUrl,
    date: '2025-05-05',
    category: 'Kochen',
    imageUrl: unsplash('1504674900247-0877df9cc836'),
    content: ['Ein einfaches Gericht, das jeder zuhause nachkochen kann.']
  },
  '4:401': {
    id: '401',
    blogId: '4',
    blogName: 'Marys grüner Daumen',
    title: 'Urban Gardening für Anfänger',
    author: u('mary.williams')?.name ?? '',
    authorAvatarUrl: u('mary.williams')?.avatarUrl,
    date: '2025-04-18',
    category: 'Garten',
    imageUrl: unsplash('1459664018906-085c36f472af'),
    content: ['Wie du auch auf dem Balkon frische Kräuter ziehen kannst.']
  },
  '5:501': {
    id: '501',
    blogId: '5',
    blogName: 'Davids Sternenbilder',
    title: 'Die Milchstraße fotografieren',
    author: u('david.brown')?.name ?? '',
    authorAvatarUrl: u('david.brown')?.avatarUrl,
    date: '2025-06-11',
    category: 'Fotografie',
    imageUrl: unsplash('1500534623283-312aade485b7'),
    content: ['Tipps, wie du die Milchstraße mit einfacher Ausrüstung festhältst.']
  }
} as const;

/** ---------- Menu & Visibility Guard ---------- */

export const menuData: Readonly<MenuItem[]> = [
  { prependAvatar: logo, to: '/' },
  { type: 'divider' },
  { title: 'Login', prependIcon: 'mdi-login', to: '/login', roles: [Role.Guest] },
  { title: 'Register', prependIcon: 'mdi-account-plus', to: '/register', roles: [Role.Guest] },
  { type: 'divider' },
  { title: 'Profiles', prependIcon: 'mdi-account-group-outline', to: '/profiles' },
  { title: 'Blogs', prependIcon: 'mdi-post-outline', to: '/blogs' },
  { type: 'divider' },
  {
    title: 'Conversations',
    prependIcon: 'mdi-message-text-outline',
    to: '/conversations',
    roles: [Role.User]
  },
  {
    title: 'Photos',
    prependIcon: 'mdi-image-multiple',
    to: (id: string | undefined) => `/photos/${id || ''}`,
    roles: [Role.User]
  },
  { type: 'divider' },
  {
    title: 'Error 401',
    prependIcon: 'mdi-alert-circle-outline',
    to: '/error/401',
    roles: [Role.Developer]
  },
  {
    title: 'Error 403',
    prependIcon: 'mdi-alert-octagon-outline',
    to: '/error/403',
    roles: [Role.Developer]
  },
  {
    title: 'Error 404',
    prependIcon: 'mdi-alert-box-outline',
    to: '/error/404',
    roles: [Role.Developer]
  },
  {
    title: 'Error 500',
    prependIcon: 'mdi-alert-decagram-outline',
    to: '/error/500',
    roles: [Role.Developer]
  }
] as const;

/** Sichtbarkeit: Standard = sichtbar, wenn kein roles-Array angegeben.
 *  Wenn vorhanden: role >= mindestens einer geforderten Rolle.
 */
export const isMenuVisibleFor = (userRole: Role, item: MenuItem): boolean => {
  if (!('roles' in item) || !item.roles || item.roles.length === 0) return true;
  return item.roles.some(required => roleAtLeast(userRole, required));
};

/** ---------- Conversations ---------- */
export const mockConversations: Readonly<Conversation[]> = [
  {
    id: 1,
    partner: 'Alice',
    lastMessage: 'Hey, how are you? Long time no see!',
    time: '10:30 AM',
    unreadCount: 2,
    messages: [
      { id: 1, sender: 'Alice', text: 'Hi there!', time: '10:28 AM' },
      { id: 2, sender: 'You', text: 'Hey, how are you?', time: '10:30 AM', read: true },
      { id: 3, sender: 'Alice', text: "I'm doing great, thanks! How about you?", time: '10:32 AM' },
      {
        id: 4,
        sender: 'You',
        text: 'All good here. Just busy with work.',
        time: '10:35 AM',
        read: true
      },
      { id: 5, sender: 'Alice', text: 'Same here! We should catch up soon.', time: '10:40 AM' }
    ]
  },
  {
    id: 2,
    partner: 'Bob',
    lastMessage: 'See you tomorrow for the project meeting!',
    time: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 6,
        sender: 'Bob',
        text: 'Are you free tomorrow for the project meeting?',
        time: 'Yesterday 3:00 PM'
      },
      {
        id: 7,
        sender: 'You',
        text: 'Yes, I am. What time?',
        time: 'Yesterday 3:05 PM',
        read: true
      },
      { id: 8, sender: 'Bob', text: 'At 10 AM. See you then!', time: 'Yesterday 3:10 PM' },
      {
        id: 9,
        sender: 'You',
        text: 'Got it. See you tomorrow!',
        time: 'Yesterday 3:15 PM',
        read: true
      }
    ]
  },
  {
    id: 3,
    partner: 'Charlie',
    lastMessage: "Don't forget the report deadline is Friday.",
    time: '2 days ago',
    unreadCount: 1,
    messages: [
      {
        id: 10,
        sender: 'Charlie',
        text: 'Hi, just a reminder about the report.',
        time: '2 days ago 9:00 AM'
      },
      {
        id: 11,
        sender: 'You',
        text: 'Thanks for the reminder!',
        time: '2 days ago 9:05 AM',
        read: true
      },
      {
        id: 12,
        sender: 'Charlie',
        text: 'No problem. The deadline is Friday.',
        time: '2 days ago 9:10 AM'
      }
    ]
  },
  {
    id: 4,
    partner: 'David',
    lastMessage: 'Sounds good! Let me know if you need anything else.',
    time: 'Last week',
    unreadCount: 0,
    messages: [
      {
        id: 13,
        sender: 'You',
        text: 'Can you send me the updated figures?',
        time: 'Last week',
        read: true
      },
      { id: 14, sender: 'David', text: "Sure, I'll send them over.", time: 'Last week' },
      { id: 15, sender: 'You', text: 'Thanks!', time: 'Last week', read: true },
      {
        id: 16,
        sender: 'David',
        text: 'Sounds good! Let me know if you need anything else.',
        time: 'Last week'
      }
    ]
  },
  {
    id: 5,
    partner: 'Eve',
    lastMessage: 'Are you coming to the team lunch?',
    time: 'Just now',
    unreadCount: 3,
    messages: [
      { id: 17, sender: 'Eve', text: 'Hey, are you free for a quick chat?', time: 'Just now' },
      { id: 18, sender: 'Eve', text: 'I wanted to ask about the new feature.', time: 'Just now' },
      { id: 19, sender: 'Eve', text: 'Are you coming to the team lunch?', time: 'Just now' }
    ]
  }
] as const;

/** ---------- Notifications ---------- */
export const mockNotifications: Readonly<NotificationItem[]> = [
  {
    id: 1,
    title: 'New follower',
    subtitle: '<strong>John Doe</strong> started following you.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-1.png',
    time: '10m ago',
    link: '/profiles/guest/edit',
    read: false
  },
  {
    id: 2,
    title: 'Photo liked',
    subtitle: '<strong>Jane Smith</strong> liked your <strong>photo.jpg</strong>.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-2.png',
    time: '1h ago',
    link: '/photos/guest',
    read: true
  },
  {
    id: 3,
    title: 'New comment',
    subtitle: '<strong>Peter Jones</strong> commented on your <strong>post</strong>.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-3.png',
    time: '2h ago',
    link: '/conversations',
    read: false
  },
  {
    id: 4,
    title: 'Server update',
    subtitle: 'Your server has been updated to the latest version.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-4.png',
    time: '1d ago',
    link: '/developer/store',
    read: false
  }
] as const;

/** ---------- Gallery ---------- */
export const mockGalleryItems: Readonly<GalleryItem[]> = [
  {
    id: 15,
    src: 'https://picsum.photos/500/300?image=15',
    lazySrc: 'https://picsum.photos/10/6?image=15',
    aspectRatio: 500 / 300
  },
  {
    id: 25,
    src: 'https://picsum.photos/400/600?image=25',
    lazySrc: 'httpsum.photos/8/12?image=25'.replace('httpsum', 'https://picsum'),
    aspectRatio: 400 / 600
  },
  {
    id: 35,
    src: 'https://picsum.photos/600/400?image=35',
    lazySrc: 'https://picsum.photos/12/8?image=35',
    aspectRatio: 600 / 400
  },
  {
    id: 45,
    src: 'https://picsum.photos/300/500?image=45',
    lazySrc: 'https://picsum.photos/6/10?image=45',
    aspectRatio: 300 / 500
  },
  {
    id: 55,
    src: 'https://picsum.photos/700/500?image=55',
    lazySrc: 'https://picsum.photos/14/10?image=55',
    aspectRatio: 700 / 500
  },
  {
    id: 65,
    src: 'https://picsum.photos/500/700?image=65',
    lazySrc: 'https://picsum.photos/10/14?image=65',
    aspectRatio: 500 / 700
  },
  {
    id: 11,
    src: 'https://picsum.photos/500/300?image=11',
    lazySrc: 'https://picsum.photos/10/6?image=11',
    aspectRatio: 500 / 300
  },
  {
    id: 22,
    src: 'https://picsum.photos/400/600?image=22',
    lazySrc: 'https://picsum.photos/8/12?image=22',
    aspectRatio: 400 / 600
  },
  {
    id: 33,
    src: 'https://picsum.photos/600/400?image=33',
    lazySrc: 'https://picsum.photos/12/8?image=33',
    aspectRatio: 600 / 400
  },
  {
    id: 44,
    src: 'https://picsum.photos/300/500?image=44',
    lazySrc: 'https://picsum.photos/6/10?image=44',
    aspectRatio: 300 / 500
  },
  {
    id: 51,
    src: 'https://picsum.photos/700/500?image=51',
    lazySrc: 'https://picsum.photos/14/10?image=51',
    aspectRatio: 700 / 500
  },
  {
    id: 62,
    src: 'https://picsum.photos/500/700?image=62',
    lazySrc: 'https://picsum.photos/10/14?image=62',
    aspectRatio: 500 / 700
  }
] as const;
