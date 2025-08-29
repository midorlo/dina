import type { NotificationItem } from '@/types';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { delay, useMocks } from '@/utils/mock.ts';

// Helper to assemble a full NotificationItem object from the normalized DB
function assembleNotification(notificationData: (typeof db.notifications)[0]): NotificationItem {
  const actor = notificationData.actorId ? db.users.find(u => u.id === notificationData.actorId) : null;
  let title = 'Notification';
  let subtitle = '';
  let link = '/';

  switch (notificationData.type) {
    case 'NEW_FOLLOWER': {
      title = 'New follower';
      subtitle = `<strong>${actor?.name ?? 'Someone'}</strong> started following you.`;
      link = `/profiles/${actor?.id}`;
      break;
    }
    case 'PHOTO_LIKED': {
      title = 'Photo liked';
      subtitle = `<strong>${actor?.name ?? 'Someone'}</strong> liked your photo.`;
      link = `/photos/${notificationData.subject?.id}`;
      break;
    }
    case 'POST_COMMENT': {
      title = 'New comment';
      subtitle = `<strong>${actor?.name ?? 'Someone'}</strong> commented on your post.`;
      const post = db.posts.find(p => p.id === notificationData.subject?.id);
      link = post?.blogId ? `/blogs/${post.blogId}/${post.id}` : '/'; // Fixed here
      break;
    }
    case 'SERVER_UPDATE': {
      title = 'Server update';
      subtitle = 'Your server has been updated to the latest version.';
      link = '/developer/store';
      break;
    }
  }

  return {
    id: notificationData.id,
    title,
    subtitle,
    avatar: actor?.avatarUrl,
    time: new Date(notificationData.createdAt).toLocaleTimeString(),
    link,
    read: notificationData.read
  };
}

// --- MOCK IMPLEMENTATION ---
function mockFetchNotifications(currentUserId: string) {
  const userNotifications = db.notifications
    .filter(n => n.recipientId === currentUserId)
    .map(notification => assembleNotification(notification));
  return delay(userNotifications, 300);
}

// --- API IMPLEMENTATION ---
const apiFetchNotifications = () => apiFetch('/api/notifications').then(res => res.json());

// --- COMPOSABLE ---
export function useNotifications() {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;

  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: () => {
      if (!currentUserId) return [];
      return useMocks ? mockFetchNotifications(currentUserId) : apiFetchNotifications();
    },
    enabled: !!currentUserId
  });
}

// --- Direct fetch helper for stores expecting promise-based API ---
export async function fetchNotifications(): Promise<NotificationItem[]> {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;
  if (!currentUserId) return [];
  return useMocks ? mockFetchNotifications(currentUserId) : apiFetchNotifications();
}
