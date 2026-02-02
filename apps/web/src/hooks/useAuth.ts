import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginRequest, RegisterRequest } from '@fateagent/shared-types';
import { fetchProfile, login, register } from '@/services/auth';
import { useUserStore } from '@/stores/userStore';

export function useAuth() {
  const setUser = useUserStore((state) => state.setUser);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetchProfile();
      if (response.data) {
        setUser(response.data);
      }
      return response;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data.user);
      }
    },
  });

  return {
    profileQuery,
    loginMutation,
    registerMutation,
  };
}
