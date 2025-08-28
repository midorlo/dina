import type { Conversation } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useConversationsStore = defineStore('conversations', () => {
  const items = ref<Conversation[]>([]);
  const error = ref<Error | null>(null);

  async function load() {
    error.value = null;
    try {
      const { fetchConversations } = await import('@/services/messages');
      items.value = await fetchConversations();
    } catch (error_) {
      error.value = error_ as Error;
    }
  }

  const unreadCount = computed(() => items.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0));

  function reset() {
    items.value = [];
  }

  return { items, unreadCount, load, reset, error };
});
