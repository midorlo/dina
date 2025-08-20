import type { Blog, Post, PostItem } from '@/types'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/services/mock'

const blogs: Blog[] = [
  {
    id: '1',
    name: 'Annas Gedanken',
    authorHandle: 'anna',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    description:
      'Ein Einblick in einen aufgeräumten Lebensstil und wie er zu mehr Klarheit führen kann.',
    postCount: 3,
    createdAt: '12. Mai 2024',
  },
  {
    id: '2',
    name: "Markus' Abenteuer",
    authorHandle: 'markus',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    description:
      'Atemberaubende Landschaften und unvergessliche Momente auf meinen Reisen durch die Welt.',
    postCount: 2,
    createdAt: '01. Januar 2024',
  },
  {
    id: '3',
    name: 'Julias Küche',
    authorHandle: 'julia',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    description:
      'Einfache Rezepte, die immer gelingen. Entdecke die Freude am Kochen, Schritt für Schritt.',
    postCount: 1,
    createdAt: '22. Februar 2024',
  },
  {
    id: '4',
    name: 'Toms grüner Daumen',
    authorHandle: 'tom',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
    description: 'Wie du auch ohne Garten frisches Gemüse und Kräuter anbauen kannst.',
    postCount: 1,
    createdAt: '12. März 2024',
  },
  {
    id: '5',
    name: 'Celinas Sternenbilder',
    authorHandle: 'celina',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
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
}

const postDetails: Record<string, Post> = {
  '1:101': {
    id: '101',
    blogId: '1',
    blogName: 'Annas Gedanken',
    title: 'Mein Weg zum Minimalismus',
    author: 'Anna',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    date: '15. August 2025',
    category: 'Lebensstil',
    imageUrl:
      'https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich? Eine Reise zu weniger Besitz und mehr Freiheit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
      'Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.',
    ],
  },
  '2:201': {
    id: '201',
    blogId: '2',
    blogName: "Markus' Abenteuer",
    title: 'Wanderung zur Zugspitze',
    author: 'Markus',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '10. August 2025',
    category: 'Reisen',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    content: [
      'Ein anstrengender Aufstieg, der mit einer unglaublichen Aussicht belohnt wurde. Mein Erfahrungsbericht.',
    ],
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
  return delay(blogs.find((b) => b.id === id), 500)
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
