import { useQuery } from '@tanstack/react-query';
import { fetchAnalysisHistory } from '@/services/analysis';

export function useHistory() {
  return useQuery({
    queryKey: ['analysis-history'],
    queryFn: fetchAnalysisHistory,
  });
}
