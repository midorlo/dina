import type { Blog, Post, PostItem } from '@/types'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/services/mock'
import { mockUsers } from '@/services/mock-data'

const [john, jane, peter, mary, david] = mockUsers.map(({ user }) => user)

const blogs: Blog[] = [
  {
    id: '1',
    name: 'Johns Gedanken',
    authorHandle: john.username ?? '',
    authorAvatarUrl: john.avatarUrl ?? '',
    description:
      'Ein Einblick in einen aufgeräumten Lebensstil und wie er zu mehr Klarheit führen kann.',
    postCount: 3,
    createdAt: '12. Mai 2024',
  },
  {
    id: '2',
    name: 'Janes Abenteuer',
    authorHandle: jane.username ?? '',
    authorAvatarUrl: jane.avatarUrl ?? '',
    description:
      'Atemberaubende Landschaften und unvergessliche Momente auf meinen Reisen durch die Welt.',
    postCount: 2,
    createdAt: '01. Januar 2024',
  },
  {
    id: '3',
    name: 'Peters Küche',
    authorHandle: peter.username ?? '',
    authorAvatarUrl: peter.avatarUrl ?? '',
    description:
      'Einfache Rezepte, die immer gelingen. Entdecke die Freude am Kochen, Schritt für Schritt.',
    postCount: 1,
    createdAt: '22. Februar 2024',
  },
  {
    id: '4',
    name: 'Marys grüner Daumen',
    authorHandle: mary.username ?? '',
    authorAvatarUrl: mary.avatarUrl ?? '',
    description: 'Wie du auch ohne Garten frisches Gemüse und Kräuter anbauen kannst.',
    postCount: 1,
    createdAt: '12. März 2024',
  },
  {
    id: '5',
    name: 'Davids Sternenbilder',
    authorHandle: david.username ?? '',
    authorAvatarUrl: david.avatarUrl ?? '',
    description:
      'Die Sterne fotografieren: Welche Ausrüstung du brauchst und die besten Tipps für den Anfang.',
    postCount: 1,
    createdAt: '02. April 2024',
  },
]

const posts: Record<string, PostItem[]> = {
  '1': [
    {
      id: 101,
      title: 'Mein Weg zum Minimalismus',
      createdAt: '15. August 2025',
      excerpt:
        'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit.',
    },
    {
      id: 102,
      title: 'Die 5-Minuten-Regel für mehr Ordnung',
      createdAt: '02. Juli 2025',
      excerpt:
        'Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten, ohne großen Aufwand.',
    },
    {
      id: 103,
      title: 'Digital Detox: Erfahrungen & Tipps',
      createdAt: '21. Juni 2025',
      excerpt:
        'Eine Woche ohne Smartphone. Was ich gelernt habe und wie auch du eine digitale Auszeit schaffen kannst.',
    },
  ],
  '2': [
    {
      id: 201,
      title: 'Wanderung zur Zugspitze',
      createdAt: '10. August 2025',
      excerpt:
        'Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.',
    },
    {
      id: 202,
      title: 'Mit dem Rucksack durch Vietnam',
      createdAt: '15. März 2025',
      excerpt:
        'Von lauten Städten bis zu stillen Reisfeldern. Eine Reise voller Kontraste und unvergesslicher Begegnungen.',
    },
  ],
  '3': [
    {
      id: 301,
      title: 'Mein Lieblingsrezept',
      createdAt: '05. Mai 2025',
      excerpt: 'Ein einfaches Gericht, das jeder zuhause nachkochen kann.',
    },
  ],
  '4': [
    {
      id: 401,
      title: 'Urban Gardening für Anfänger',
      createdAt: '18. April 2025',
      excerpt: 'Wie du auch auf dem Balkon frische Kräuter ziehen kannst.',
    },
  ],
  '5': [
    {
      id: 501,
      title: 'Die Milchstraße fotografieren',
      createdAt: '11. Juni 2025',
      excerpt: 'Tipps, wie du die Milchstraße mit einfacher Ausrüstung festhältst.',
    },
  ],
}

const postDetails: Record<string, Post> = {
  '1:101': {
    id: '101',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Mein Weg zum Minimalismus',
    author: john.name ?? '',
    authorAvatarUrl: john.avatarUrl ?? '',
    date: '15. August 2025',
    category: 'Lebensstil',
    imageUrl:
      'https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit.',
      'Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
    ],
  },
  '1:102': {
    id: '102',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Die 5-Minuten-Regel für mehr Ordnung',
    author: john.name ?? '',
    authorAvatarUrl: john.avatarUrl ?? '',
    date: '02. Juli 2025',
    category: 'Organisation',
    imageUrl:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Ein einfacher Trick, der mir geholfen hat, mein Zuhause dauerhaft ordentlich zu halten, ohne großen Aufwand.',
    ],
  },
  '1:103': {
    id: '103',
    blogId: '1',
    blogName: 'Johns Gedanken',
    title: 'Digital Detox: Erfahrungen & Tipps',
    author: john.name ?? '',
    authorAvatarUrl: john.avatarUrl ?? '',
    date: '21. Juni 2025',
    category: 'Digitales',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Eine Woche ohne Smartphone. Was ich gelernt habe und wie auch du eine digitale Auszeit schaffen kannst.',
    ],
  },
  '2:201': {
    id: '201',
    blogId: '2',
    blogName: 'Janes Abenteuer',
    title: 'Wanderung zur Zugspitze',
    author: jane.name ?? '',
    authorAvatarUrl: jane.avatarUrl ?? '',
    date: '10. August 2025',
    category: 'Reisen',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.',
    ],
  },
  '2:202': {
    id: '202',
    blogId: '2',
    blogName: 'Janes Abenteuer',
    title: 'Mit dem Rucksack durch Vietnam',
    author: jane.name ?? '',
    authorAvatarUrl: jane.avatarUrl ?? '',
    date: '15. März 2025',
    category: 'Reisen',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Von lauten Städten bis zu stillen Reisfeldern. Eine Reise voller Kontraste und unvergesslicher Begegnungen.',
    ],
  },
  '3:301': {
    id: '301',
    blogId: '3',
    blogName: 'Peters Küche',
    title: 'Mein Lieblingsrezept',
    author: peter.name ?? '',
    authorAvatarUrl: peter.avatarUrl ?? '',
    date: '05. Mai 2025',
    category: 'Kochen',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: ['Ein einfaches Gericht, das jeder zuhause nachkochen kann.'],
  },
  '4:401': {
    id: '401',
    blogId: '4',
    blogName: 'Marys grüner Daumen',
    title: 'Urban Gardening für Anfänger',
    author: mary.name ?? '',
    authorAvatarUrl: mary.avatarUrl ?? '',
    date: '18. April 2025',
    category: 'Garten',
    imageUrl:
      'https://images.unsplash.com/photo-1459664018906-085c36f472af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: ['Wie du auch auf dem Balkon frische Kräuter ziehen kannst.'],
  },
  '5:501': {
    id: '501',
    blogId: '5',
    blogName: 'Davids Sternenbilder',
    title: 'Die Milchstraße fotografieren',
    author: david.name ?? '',
    authorAvatarUrl: david.avatarUrl ?? '',
    date: '11. Juni 2025',
    category: 'Fotografie',
    imageUrl:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: ['Tipps, wie du die Milchstraße mit einfacher Ausrüstung festhältst.'],
  },
}

export async function fetchBlogs(): Promise<Blog[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/blogs')
    return res.json()
  }
  return delay(blogs, 500)
}

export async function fetchBlog(id: string): Promise<Blog | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${id}`)
    return res.json()
  }
  return delay(
    blogs.find((b) => b.id === id),
    500
  )
}

export async function fetchBlogPosts(blogId: string): Promise<PostItem[]> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${blogId}/posts`)
    return res.json()
  }
  return delay(posts[blogId] || [], 500)
}

export async function fetchBlogPost(blogId: string, postId: string): Promise<Post | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${blogId}/posts/${postId}`)
    return res.json()
  }
  return delay(postDetails[`${blogId}:${postId}`], 500)
}
