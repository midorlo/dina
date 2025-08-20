export type ConversationId = number | string
export type MessageId = number | string

export interface Message {
  id: number
  sender: string
  text: string
  time: string
  read?: boolean
}

export interface Conversation {
  id: number
  partner: string
  lastMessage: string
  time: string
  unreadCount: number
  messages: Message[]
}
