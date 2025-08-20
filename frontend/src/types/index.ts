export enum Role {
  Guest = 'guest',
  User = 'user',
  Admin = 'admin',
}

export enum Permission {
  ViewDashboard = 'view_dashboard',
  ManageUsers = 'manage_users',
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
  username: string
  avatarUrl: string
}

export interface AuthTokens {
  accessToken: string
  accessTokenExpiresAt: number
  refreshToken: string
  refreshTokenExpiresAt: number
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
  profile: Profile
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
  authorHandle: string
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

export interface GalleryItem {
  id: number
  src: string
  lazySrc: string
  aspectRatio: number
}
