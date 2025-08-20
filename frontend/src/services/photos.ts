import type { GalleryItem } from '@/types'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/services/mock'

const items: GalleryItem[] = [
  {
    id: 15,
    src: 'https://picsum.photos/500/300?image=15',
    lazySrc: 'https://picsum.photos/10/6?image=15',
    aspectRatio: 500 / 300,
  },
  {
    id: 25,
    src: 'https://picsum.photos/400/600?image=25',
    lazySrc: 'https://picsum.photos/8/12?image=25',
    aspectRatio: 400 / 600,
  },
  {
    id: 35,
    src: 'https://picsum.photos/600/400?image=35',
    lazySrc: 'https://picsum.photos/12/8?image=35',
    aspectRatio: 600 / 400,
  },
  {
    id: 45,
    src: 'https://picsum.photos/300/500?image=45',
    lazySrc: 'https://picsum.photos/6/10?image=45',
    aspectRatio: 300 / 500,
  },
  {
    id: 55,
    src: 'https://picsum.photos/700/500?image=55',
    lazySrc: 'https://picsum.photos/14/10?image=55',
    aspectRatio: 700 / 500,
  },
  {
    id: 65,
    src: 'https://picsum.photos/500/700?image=65',
    lazySrc: 'https://picsum.photos/10/14?image=65',
    aspectRatio: 500 / 700,
  },
  {
    id: 11,
    src: 'https://picsum.photos/500/300?image=11',
    lazySrc: 'https://picsum.photos/10/6?image=11',
    aspectRatio: 500 / 300,
  },
  {
    id: 22,
    src: 'https://picsum.photos/400/600?image=22',
    lazySrc: 'https://picsum.photos/8/12?image=22',
    aspectRatio: 400 / 600,
  },
  {
    id: 33,
    src: 'https://picsum.photos/600/400?image=33',
    lazySrc: 'https://picsum.photos/12/8?image=33',
    aspectRatio: 600 / 400,
  },
  {
    id: 44,
    src: 'https://picsum.photos/300/500?image=44',
    lazySrc: 'https://picsum.photos/6/10?image=44',
    aspectRatio: 300 / 500,
  },
  {
    id: 51,
    src: 'https://picsum.photos/700/500?image=51',
    lazySrc: 'https://picsum.photos/14/10?image=51',
    aspectRatio: 700 / 500,
  },
  {
    id: 62,
    src: 'https://picsum.photos/500/700?image=62',
    lazySrc: 'https://picsum.photos/10/14?image=62',
    aspectRatio: 500 / 700,
  },
]

export async function fetchPhotos(): Promise<GalleryItem[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/photos')
    return res.json()
  }
  return delay(items, 500)
}

export async function fetchPhoto(id: number): Promise<GalleryItem | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/photos/${id}`)
    return res.json()
  }
  return delay(items.find((i) => i.id === id), 500)
}
