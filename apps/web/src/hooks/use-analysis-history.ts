'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalysisHistory } from '@/services/analysis';

export function useAnalysisHistory() {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const query = useQuery({
    queryKey: ['analysis-history', page],
    queryFn: () => fetchAnalysisHistory(page, pageSize)
  });

  const total = query.data?.data?.total ?? 0;
  const hasMore = query.data?.data?.hasMore ?? false;

  return {
    query,
    page,
    setPage,
    total,
    hasMore
  };
}
