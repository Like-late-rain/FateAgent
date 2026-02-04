'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginRequest, RegisterRequest } from '@fateagent/shared-types';
import { login, register, logout } from '@/services/auth';
import { fetchMe } from '@/services/users';
import { useAuthStore } from '@/stores/auth';

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetchMe();
      if (res.success && res.data) {
        setUser(res.data);
      }
      return res;
    }
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data.user);
      }
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data.user);
      }
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearUser();
    }
  });

  return {
    meQuery,
    loginMutation,
    registerMutation,
    logoutMutation
  };
}
