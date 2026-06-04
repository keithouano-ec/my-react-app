import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { authApi } from '../services/authApi';
import useAuthStore from '../store/authStore';
import useLogout from './useLogout';

jest.mock('../services/authApi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLogout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'Jane', email: 'jane@example.com', role: 'user' },
      token: 'mock-token',
      isAuthenticated: true,
    });
  });

  it('clears auth state on successful logout', async () => {
    (authApi.logout as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
