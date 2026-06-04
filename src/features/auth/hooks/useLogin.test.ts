import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { authApi } from '../services/authApi';
import useAuthStore from '../store/authStore';
import useLogin from './useLogin';

jest.mock('../services/authApi');

const mockUser = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'user' as const,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    jest.clearAllMocks();
  });

  it('sets auth on successful login', async () => {
    (authApi.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: 'mock-token',
    });

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ email: 'jane@example.com', password: 'Password1!' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe('mock-token');
    expect(isAuthenticated).toBe(true);
  });

  it('sets error state on failed login', async () => {
    (authApi.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ email: 'bad@example.com', password: 'wrongpass' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Invalid credentials'));
  });
});
