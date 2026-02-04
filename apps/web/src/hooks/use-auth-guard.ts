'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '@/hooks/use-auth';

const protectedPrefixes = ['/dashboard'];

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { meQuery } = useAuth();

  useEffect(() => {
    const needsAuth = protectedPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (!needsAuth) {
      return;
    }
    if (!user && !meQuery.isFetching) {
      router.replace('/login');
    }
  }, [pathname, user, meQuery.isFetching, router]);

  return {
    isLoading: meQuery.isFetching,
    user
  };
}
