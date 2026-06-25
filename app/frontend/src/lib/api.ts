const BASE = '/api/v1';

const TOKEN_KEY = 'rh_litoral_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message ?? msg;
    } catch {
      /* corpo sem JSON */
    }
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(res.status, Array.isArray(msg) ? msg.join(', ') : msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
