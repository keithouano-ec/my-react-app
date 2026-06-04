import { act, renderHook } from '@testing-library/react';

import useAuthStore from './authStore';

const mockUser = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'user' as const,
};

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('sets auth state on setAuth', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuth(mockUser, 'mock-token');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears auth state on clearAuth', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuth(mockUser, 'mock-token');
      result.current.clearAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
