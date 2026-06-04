import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../services/authApi';
import useAuthStore from '../store/authStore';

const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });
};

export default useLogout;
