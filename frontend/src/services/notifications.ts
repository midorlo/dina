import type { NotificationItem } from '@/types';
import { mockNotifications } from '@/data/mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

export async function fetchNotifications(): Promise<NotificationItem[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/notifications');
    return res.json();
  }
  return delay([...(mockNotifications as NotificationItem[])], 300);
}
