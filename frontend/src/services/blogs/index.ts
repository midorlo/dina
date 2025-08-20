import type { Blog, PostItem } from '@/types'

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

export async function fetchBlogs(): Promise<Blog[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(blogs), 500)
  })
}

export async function fetchBlog(id: string): Promise<Blog | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(blogs.find((b) => b.id === id)), 500)
  })
}

export async function fetchBlogPosts(blogId: string): Promise<PostItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(posts[blogId] || []), 500)
  })
}
