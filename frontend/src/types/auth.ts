import type { Profile } from './profile'

export enum Role {
  Any = 'any',
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
  Administrator = 'administrator',
  Developer = 'developer',
  Banned = 'banned',
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
  avatarUrl?: string
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
