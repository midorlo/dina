import type { GalleryItem } from '@/types';
import { mockGalleryItems } from '@/data/mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

export async function fetchPhotos(): Promise<GalleryItem[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/photos');
    return res.json();
  }
  return delay(mockGalleryItems, 500);
}

export async function fetchPhoto(id: number): Promise<GalleryItem | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/photos/${id}`);
    return res.json();
  }
  return delay(
    mockGalleryItems.find(i => i.id === id),
    500
  );
}
