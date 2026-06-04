import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { authApi } from '../../services/authApi';
import LoginForm from './LoginForm';

jest.mock('../../services/authApi');

const mockUser = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'user' as const,
};

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui),
  );
};

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderWithClient(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    renderWithClient(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('disables the button while submitting', async () => {
    (authApi.login as jest.Mock).mockResolvedValueOnce(
      new Promise((resolve) => setTimeout(() => resolve({ user: mockUser, token: 'tok' }), 200)),
    );

    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('displays API error message on failed login', async () => {
    (authApi.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('calls onSuccess callback after successful login', async () => {
    (authApi.login as jest.Mock).mockResolvedValueOnce({ user: mockUser, token: 'mock-token' });

    const onSuccess = jest.fn();
    renderWithClient(<LoginForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });
});
