import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JwtPayload, UserRole } from '@chasehorse/shared';

interface AuthState {
  user: JwtPayload | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: JwtPayload, token: string) => void;
  clearAuth: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      hasRole: (roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },
    }),
    { name: 'chasehorse-auth' },
  ),
);

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787')
  : 'http://localhost:8787';

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Request failed');
    return data;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

export async function login(email: string, password: string) {
  const res = await api.post<{
    success: boolean;
    data: { user: JwtPayload; accessToken: string; refreshToken: string };
  }>('/api/auth/login', { email, password });
  return res.data;
}

export async function register(data: { email: string; password: string; name: string; phone?: string }) {
  const res = await api.post<{
    success: boolean;
    data: { user: JwtPayload; accessToken: string };
  }>('/api/auth/register', data);
  return res.data;
}

export async function logout() {
  await api.post('/api/auth/logout', {});
}

export async function requestOtp(phone: string) {
  return api.post('/api/auth/otp/request', { phone });
}

export async function verifyOtp(phone: string, otp: string) {
  const res = await api.post<{
    success: boolean;
    data: { user: JwtPayload; accessToken: string };
  }>('/api/auth/otp/verify', { phone, otp });
  return res.data;
}
