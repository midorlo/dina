import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { NotificationItem } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const router = useRouter()

  const items = ref<NotificationItem[]>([
    {
      id: 1,
      title: 'New follower',
      subtitle: '<strong>John Doe</strong> started following you.',
      avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-1.png',
      time: '10m ago',
      link: '/profile',
      read: false,
    },
    {
      id: 2,
      title: 'Photo liked',
      subtitle: '<strong>Jane Smith</strong> liked your <strong>photo.jpg</strong>.',
      avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-2.png',
      time: '1h ago',
      link: '/gallery',
      read: true,
    },
    {
      id: 3,
      title: 'New comment',
      subtitle: '<strong>Peter Jones</strong> commented on your <strong>post</strong>.',
      avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-3.png',
      time: '2h ago',
      link: '/messages',
      read: false,
    },
    {
      id: 4,
      title: 'Server update',
      subtitle: 'Your server has been updated to the latest version.',
      avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-4.png',
      time: '1d ago',
      link: '/settings',
      read: false,
    },
  ])

  const unreadCount = computed(() => items.value.filter((item) => !item.read).length)

  function handleNotificationClick(item: NotificationItem) {
    const notification = items.value.find((n) => n.id === item.id)
    if (notification) {
      notification.read = true
    }
    router.push(item.link)
  }

  return { items, unreadCount, handleNotificationClick }
})
