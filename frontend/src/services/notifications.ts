import type { NotificationItem } from '@/types'

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'New follower',
    subtitle: '<strong>John Doe</strong> started following you.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-1.png',
    time: '10m ago',
    link: '/profiles/guest/edit',
    read: false,
  },
  {
    id: 2,
    title: 'Photo liked',
    subtitle: '<strong>Jane Smith</strong> liked your <strong>photo.jpg</strong>.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-2.png',
    time: '1h ago',
    link: '/photos/guest',
    read: true,
  },
  {
    id: 3,
    title: 'New comment',
    subtitle: '<strong>Peter Jones</strong> commented on your <strong>post</strong>.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-3.png',
    time: '2h ago',
    link: '/conversations',
    read: false,
  },
  {
    id: 4,
    title: 'Server update',
    subtitle: 'Your server has been updated to the latest version.',
    avatar: 'https://cdn.vuetifyjs.com/images/avatars/avatar-4.png',
    time: '1d ago',
    link: '/developer/store',
    read: false,
  },
]

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNotifications), 300)
  })
}
