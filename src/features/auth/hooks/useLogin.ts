import { useMutation } from '@tanstack/react-query';

import { authApi } from '../services/authApi';
import useAuthStore from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';

const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
    },
  });
};

export default useLogin;
