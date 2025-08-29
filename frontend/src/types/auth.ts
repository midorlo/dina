/** ---------- Roles & Permissions ---------- */

import type { Profile } from './profile';

export enum Permission {
  ViewDashboard = 'view_dashboard',
  ManageUsers = 'manage_users'
}

export enum Role {
  Any = 'any',
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
  Administrator = 'administrator',
  Developer = 'developer',
  Banned = 'banned'
}

/** Rollenrang für verlässliche Vergleiche (höher = mehr Rechte) */
export const roleRank: Readonly<Record<Role, number>> = {
  [Role.Banned]: -1,
  [Role.Guest]: 0,
  [Role.User]: 1,
  [Role.Moderator]: 2,
  [Role.Administrator]: 3,
  [Role.Developer]: 4,
  [Role.Any]: 0 // neutral/default
} as const;

export const roleAtLeast = (role: Role, required: Role): boolean => roleRank[role] >= roleRank[required];

/** Basis-Permissions, ggf. ergänzt über roleAtLeast(...) Checks in Guards */
export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.Any]: [],
  [Role.Guest]: [],
  [Role.User]: [Permission.ViewDashboard],
  [Role.Moderator]: [Permission.ViewDashboard],
  [Role.Administrator]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Developer]: [Permission.ViewDashboard, Permission.ManageUsers],
  [Role.Banned]: []
} as const;

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

/** ---------- User & Auth Types ---------- */

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface LoginResponse {
  user: User;
  profile: Profile | null;
  tokens: AuthTokens;
}
