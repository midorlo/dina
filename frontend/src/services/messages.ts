import type { Conversation, Message } from '@/types';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { delay, useMocks } from '@/utils/mock.ts';

// =================================================================
// Data Assembly Helpers
// =================================================================

function assembleConversation(conversationData: (typeof db.conversations)[0], currentUserId: string): Conversation {
  const partnerId = conversationData.participantIds.find(id => id !== currentUserId);
  const partner = db.users.find(u => u.id === partnerId);
  const messagesForConversation = db.messages.filter(m => m.conversationId === conversationData.id);
  const lastMessage = messagesForConversation.at(-1);

  return {
    id: conversationData.id,
    partner: partner?.name ?? 'Unknown User',
    avatar: partner?.avatarUrl ?? undefined,
    lastMessage: lastMessage?.text ?? '',
    time: lastMessage
      ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    unreadCount: messagesForConversation.filter(m => !m.read && m.senderId !== currentUserId).length,
    messages: messagesForConversation.map(m => ({
      id: m.id as string, // Explicitly cast to string
      text: m.text,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: m.senderId === currentUserId ? 'You' : (partner?.name ?? 'Unknown'),
      read: m.read
    }))
  };
}

function assembleMessage(messageData: (typeof db.messages)[0], currentUserId: string): Message {
  let senderName = 'Unknown';
  if (messageData.senderId === currentUserId) {
    senderName = 'You';
  } else {
    const sender = db.users.find(u => u.id === messageData.senderId);
    senderName = sender?.name ?? 'Unknown';
  }

  return {
    id: messageData.id as string, // Explicitly cast to string
    text: messageData.text,
    time: new Date(messageData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: senderName,
    read: messageData.read
  };
}

// =================================================================
// Vue Query Composables
// =================================================================

// --- MOCK IMPLEMENTATIONS ---

function mockFetchConversations(currentUserId: string) {
  const userConversations = db.conversations.filter(c => c.participantIds.includes(currentUserId));
  const assembled = userConversations.map(c => assembleConversation(c, currentUserId));
  return delay(assembled, 500);
}

function mockFetchConversation(id: string, currentUserId: string) {
  const conversationData = db.conversations.find(c => c.id === id);
  if (!conversationData || !conversationData.participantIds.includes(currentUserId)) {
    return delay(undefined, 500);
  }
  return delay(assembleConversation(conversationData, currentUserId), 500);
}

function mockFetchMessage(conversationId: string, messageId: string, currentUserId: string) {
  const messageData = db.messages.find(m => m.id === messageId && m.conversationId === conversationId);
  if (!messageData) return delay(undefined, 500);
  return delay(assembleMessage(messageData, currentUserId), 500);
}

// --- API IMPLEMENTATIONS ---

const apiFetchConversations = () => apiFetch('/api/v1/conversations').then(res => res.json());
const apiFetchConversation = (id: string) => apiFetch(`/api/v1/conversations/${id}`).then(res => res.json());
function apiFetchMessage(conversationId: string, messageId: string) {
  return apiFetch(`/api/v1/conversations/${conversationId}/messages/${messageId}`).then(res => res.json());
}

// --- COMPOSABLES ---

export function useConversations() {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;

  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => {
      if (!currentUserId) return [];
      return useMocks ? mockFetchConversations(currentUserId) : apiFetchConversations();
    },
    enabled: !!currentUserId // Only run the query if the user is logged in
  });
}

export function useConversation(id: string) {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;

  return useQuery<Conversation | undefined>({
    queryKey: ['conversations', id],
    queryFn: () => {
      if (!currentUserId) return undefined;
      return useMocks ? mockFetchConversation(id, currentUserId) : apiFetchConversation(id);
    },
    enabled: !!currentUserId
  });
}

export function useMessage(conversationId: string, messageId: string) {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;

  return useQuery<Message | undefined>({
    queryKey: ['conversations', conversationId, 'messages', messageId],
    queryFn: () => {
      if (!currentUserId) return undefined;
      return useMocks
        ? mockFetchMessage(conversationId, messageId, currentUserId)
        : apiFetchMessage(conversationId, messageId);
    },
    enabled: !!(currentUserId && conversationId && messageId)
  });
}

// --- Direct fetch helpers for stores expecting promise-based APIs ---
export async function fetchConversations(): Promise<Conversation[]> {
  const authStore = useAuthStore();
  const currentUserId = authStore.currentUser?.id;
  if (!currentUserId) return [];
  return useMocks ? mockFetchConversations(currentUserId) : apiFetchConversations();
}
