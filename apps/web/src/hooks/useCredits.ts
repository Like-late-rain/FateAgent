import { useQuery } from '@tanstack/react-query';
import { fetchCredits } from '@/services/auth';

export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: fetchCredits,
  });
}
