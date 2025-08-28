import type { NotificationItem } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSnackbarStore } from '@/stores/snackbar';

export const useNotificationsStore = defineStore('notifications', () => {
  const router = useRouter();
  const items = ref<NotificationItem[]>([]);
  const error = ref<Error | null>(null);
  const snackbar = useSnackbarStore();

  async function load() {
    error.value = null;
    try {
      const { fetchNotifications } = await import('@/services/notifications');
      items.value = await fetchNotifications();
    } catch (error_) {
      error.value = error_ as Error;
      snackbar.showSnackbar('Failed to load notifications', 'error');
    }
  }

  const unreadCount = computed(() => items.value.filter(item => !item.read).length);

  function handleNotificationClick(item: NotificationItem) {
    const notification = items.value.find(n => n.id === item.id);
    if (notification) {
      notification.read = true;
    }
    router.push(item.link);
  }

  function reset() {
    load();
  }

  return { items, unreadCount, handleNotificationClick, reset, error, load };
});
