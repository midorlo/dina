export type ConversationId = string;
export type MessageId = string;

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  partner: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}
