import type { Profile } from './profile';
import { Role } from '@/data/mock-data';

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

export type { Permission } from '@/data/mock-data';
// eslint-disable-next-line unicorn/prefer-export-from
export { Role };
