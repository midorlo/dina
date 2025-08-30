import type { GalleryItem } from '@/types';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

// Helper to assemble a GalleryItem from the normalized DB
function assembleGalleryItem(photoData: (typeof db.photos)[0]): GalleryItem {
  return {
    id: photoData.id,
    src: photoData.src,
    lazySrc: photoData.src.replace('picsum.photos', 'picsum.photos/seed/' + photoData.id + '/10/6'),
    aspectRatio: photoData.aspectRatio
  };
}

// --- MOCK IMPLEMENTATIONS ---
function mockFetchPhotos() {
  return delay(
    db.photos.map(photo => assembleGalleryItem(photo)),
    500
  );
}
function mockFetchPhoto(id: string) {
  const photoData = db.photos.find(i => i.id === id);
  if (!photoData) return delay(undefined, 500);
  return delay(assembleGalleryItem(photoData), 500);
}

// --- API IMPLEMENTATIONS ---
const apiFetchPhotos = () => apiFetch('/api/v1/photos').then(res => res.json());
const apiFetchPhoto = (id: string) => apiFetch(`/api/v1/photos/${id}`).then(res => res.json());

// --- COMPOSABLES ---
export function usePhotos() {
  return useQuery<GalleryItem[]>({
    queryKey: ['photos'],
    queryFn: useMocks ? mockFetchPhotos : apiFetchPhotos
  });
}

export function usePhoto(id: string) {
  return useQuery<GalleryItem | undefined>({
    queryKey: ['photos', id],
    queryFn: () => (useMocks ? mockFetchPhoto(id) : apiFetchPhoto(id)),
    enabled: !!id
  });
}
