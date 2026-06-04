import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import useAuthStore from '../../store/authStore';
import AuthGuard from './AuthGuard';

const renderWithRouter = (isAuthenticated: boolean) => {
  useAuthStore.setState({
    isAuthenticated,
    user: isAuthenticated
      ? { id: '1', name: 'Jane', email: 'jane@example.com', role: 'user' }
      : null,
    token: isAuthenticated ? 'mock-token' : null,
  });

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <div>Protected Content</div>
            </AuthGuard>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderWithRouter(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
