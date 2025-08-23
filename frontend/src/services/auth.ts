import { mockUsers } from '@/data/mock-data.ts';
import { apiFetch } from '@/services/api';
import { type AuthTokens, type LoginResponse, Role } from '@/types';
import { useMocks } from '@/utils/mock.ts';

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!useMocks) {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockUsers.find(u => u.user.email === email);
      if (found && password === 'password') {
        if (found.user.role === Role.Banned) {
          reject(new Error('User is banned'));
          return;
        }
        const tokens: AuthTokens = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
          refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        resolve({ user: found.user, tokens, profile: found.profile });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
}
