'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCredits } from '@/services/users';

export function useCredits() {
  const query = useQuery({
    queryKey: ['credits'],
    queryFn: fetchCredits
  });

  return query;
}
