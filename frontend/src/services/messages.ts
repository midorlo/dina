import type { Conversation } from '@/types';
import { mockConversations } from '@/data/mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

export async function fetchConversations(): Promise<Conversation[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/conversations');
    return res.json();
  }
  return delay([...(mockConversations as Conversation[])], 500);
}

export async function fetchConversation(id: string | number): Promise<Conversation | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/conversations/${id}`);
    return res.json();
  }
  return delay(
    (mockConversations as Conversation[]).find(c => c.id === Number(id)),
    500
  );
}

export async function fetchMessage(conversationId: string | number, messageId: string | number) {
  if (!useMocks) {
    const res = await apiFetch(`/api/conversations/${conversationId}/messages/${messageId}`);
    return res.json();
  }
  const conv = (mockConversations as Conversation[]).find(c => c.id === Number(conversationId));
  return delay(
    conv?.messages.find(m => m.id === Number(messageId)),
    500
  );
}
