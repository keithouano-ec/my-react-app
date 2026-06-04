import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { User } from '../types/auth.types';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
        clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' },
    ),
    { name: 'AuthStore' },
  ),
);

export default useAuthStore;
