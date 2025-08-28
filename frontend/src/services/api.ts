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

  const base = (import.meta as any).env?.VITE_API_BASE_URL ?? '';
  const resolved: RequestInfo | URL =
    typeof input === 'string' && !/^https?:\/\//i.test(input) ? (base as string) + input : input;

  const res = await fetch(resolved, { ...init, headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res;
}
