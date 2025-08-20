import type { Conversation } from '@/types'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/services/mock'

const conversations: Conversation[] = [
  {
    id: 1,
    partner: 'Alice',
    lastMessage: 'Hey, how are you? Long time no see!',
    time: '10:30 AM',
    unreadCount: 2,
    messages: [
      { id: 1, sender: 'Alice', text: 'Hi there!', time: '10:28 AM' },
      { id: 2, sender: 'You', text: 'Hey, how are you?', time: '10:30 AM', read: true },
      {
        id: 3,
        sender: 'Alice',
        text: "I'm doing great, thanks! How about you?",
        time: '10:32 AM',
      },
      {
        id: 4,
        sender: 'You',
        text: 'All good here. Just busy with work.',
        time: '10:35 AM',
        read: true,
      },
      { id: 5, sender: 'Alice', text: 'Same here! We should catch up soon.', time: '10:40 AM' },
    ],
  },
  {
    id: 2,
    partner: 'Bob',
    lastMessage: 'See you tomorrow for the project meeting!',
    time: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 6,
        sender: 'Bob',
        text: 'Are you free tomorrow for the project meeting?',
        time: 'Yesterday 3:00 PM',
      },
      {
        id: 7,
        sender: 'You',
        text: 'Yes, I am. What time?',
        time: 'Yesterday 3:05 PM',
        read: true,
      },
      { id: 8, sender: 'Bob', text: 'At 10 AM. See you then!', time: 'Yesterday 3:10 PM' },
      {
        id: 9,
        sender: 'You',
        text: 'Got it. See you tomorrow!',
        time: 'Yesterday 3:15 PM',
        read: true,
      },
    ],
  },
  {
    id: 3,
    partner: 'Charlie',
    lastMessage: "Don't forget the report deadline is Friday.",
    time: '2 days ago',
    unreadCount: 1,
    messages: [
      {
        id: 10,
        sender: 'Charlie',
        text: 'Hi, just a reminder about the report.',
        time: '2 days ago 9:00 AM',
      },
      {
        id: 11,
        sender: 'You',
        text: 'Thanks for the reminder!',
        time: '2 days ago 9:05 AM',
        read: true,
      },
      {
        id: 12,
        sender: 'Charlie',
        text: 'No problem. The deadline is Friday.',
        time: '2 days ago 9:10 AM',
      },
    ],
  },
  {
    id: 4,
    partner: 'David',
    lastMessage: 'Sounds good! Let me know if you need anything else.',
    time: 'Last week',
    unreadCount: 0,
    messages: [
      {
        id: 13,
        sender: 'You',
        text: 'Can you send me the updated figures?',
        time: 'Last week',
        read: true,
      },
      { id: 14, sender: 'David', text: "Sure, I'll send them over.", time: 'Last week' },
      { id: 15, sender: 'You', text: 'Thanks!', time: 'Last week', read: true },
      {
        id: 16,
        sender: 'David',
        text: 'Sounds good! Let me know if you need anything else.',
        time: 'Last week',
      },
    ],
  },
  {
    id: 5,
    partner: 'Eve',
    lastMessage: 'Are you coming to the team lunch?',
    time: 'Just now',
    unreadCount: 3,
    messages: [
      { id: 17, sender: 'Eve', text: 'Hey, are you free for a quick chat?', time: 'Just now' },
      { id: 18, sender: 'Eve', text: 'I wanted to ask about the new feature.', time: 'Just now' },
      { id: 19, sender: 'Eve', text: 'Are you coming to the team lunch?', time: 'Just now' },
    ],
  },
]

export async function fetchConversations(): Promise<Conversation[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/conversations')
    return res.json()
  }
  return delay(conversations, 500)
}

export async function fetchConversation(id: string | number): Promise<Conversation | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/conversations/${id}`)
    return res.json()
  }
  return delay(conversations.find((c) => c.id === Number(id)), 500)
}

export async function fetchMessage(conversationId: string | number, messageId: string | number) {
  if (!useMocks) {
    const res = await apiFetch(`/api/conversations/${conversationId}/messages/${messageId}`)
    return res.json()
  }
  const conv = conversations.find((c) => c.id === Number(conversationId))
  return delay(conv?.messages.find((m) => m.id === Number(messageId)), 500)
}
