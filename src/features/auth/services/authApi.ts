import type { AuthResponse, LoginCredentials } from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message ?? 'Login failed');
    }

    return response.json() as Promise<AuthResponse>;
  },

  logout: async (): Promise<void> => {
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  },
};
