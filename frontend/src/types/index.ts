export enum Role {
  User = 'user',
  Guest = 'guest',
  Banned = 'banned',
  Moderator = 'moderator',
  Administrator = 'administrator',
  Developer = 'developer',
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
}

export interface Profile {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  bio?: string
  status?: 'online' | 'offline'
  lastSeen?: string
}

export interface Message {
  id: number
  sender: string
  text: string
  time: string
  read?: boolean // Optional, as it's only for 'You' messages
}

export interface Conversation {
  id: number
  partner: string
  lastMessage: string
  time: string
  unreadCount: number
  messages: Message[]
}

export interface NotificationItem {
  id: number
  title: string
  subtitle: string
  avatar: string
  time: string
  link: string
  read: boolean
}

export interface Blog {
  id: string
  name: string
  description: string
  authorAvatarUrl: string
  postCount: number
  createdAt: string
}

export interface PostItem {
  id: number
  title: string
  createdAt: string
  excerpt: string
}
