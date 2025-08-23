import type { Profile } from './profile';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  username: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  profile: Profile;
}

export { Permission, Role } from '@/data/mock-data';
