import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useAuthStore from '../../store/authStore';

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

const AuthGuard = ({ children, redirectTo = '/login' }: AuthGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
