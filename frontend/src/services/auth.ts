import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { type AuthTokens, type LoginResponse, Role, type User } from '@/types/auth';
import { useMocks } from '@/utils/mock.ts';

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!useMocks) {
    const res = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = db.users.find(u => u.email === email);
      if (user && password === 'password') {
        if (user.role === Role.Banned) {
          reject(new Error('User is banned'));
          return;
        }
        const profile = db.profiles.find(p => p.userId === user.id);
        const tokens: AuthTokens = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
          refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        // Ensure User contains required `username` property
        const normalizedUser: User = {
          ...user,
          username: profile?.username ?? user.email.split('@')[0]
        };
        resolve({ user: normalizedUser, tokens, profile: profile || null });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
}
