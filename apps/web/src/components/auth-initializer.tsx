'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/services/users';
import { useAuthStore } from '@/stores/auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 分钟内不重新请求
  });

  useEffect(() => {
    if (isSuccess && data?.success && data.data) {
      setUser(data.data);
    } else if (isError || (isSuccess && !data?.success)) {
      clearUser();
    }
  }, [isSuccess, isError, data, setUser, clearUser]);

  return <>{children}</>;
}
