import type { NotificationItem } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useNotificationsStore = defineStore('notifications', () => {
  const router = useRouter()
  const items = ref<NotificationItem[]>([])

  async function load() {
    const { fetchNotifications } = await import('@/services/notifications')
    items.value = await fetchNotifications()
  }

  load()

  const unreadCount = computed(() => items.value.filter((item) => !item.read).length)

  function handleNotificationClick(item: NotificationItem) {
    const notification = items.value.find((n) => n.id === item.id)
    if (notification) {
      notification.read = true
    }
    router.push(item.link)
  }

  function reset() {
    load()
  }

  return { items, unreadCount, handleNotificationClick, reset }
})
