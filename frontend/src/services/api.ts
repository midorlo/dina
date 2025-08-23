import { useAuthStore } from '@/stores/auth';

export function getAuthHeaders(): HeadersInit {
  const auth = useAuthStore();
  const headers: HeadersInit = {};
  const token = auth.tokens;
  if (token && token.accessToken && token.accessTokenExpiresAt > Date.now()) {
    headers['Authorization'] = `Bearer ${token.accessToken}`;
  }
  return headers;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const authHeaders = getAuthHeaders();
  for (const [key, value] of Object.entries(authHeaders)) headers.set(key, value as string);
  return fetch(input, { ...init, headers });
}
