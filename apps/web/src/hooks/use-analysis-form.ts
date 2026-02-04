'use client';

import { useForm } from 'react-hook-form';
import type { AnalysisRequest } from '@fateagent/shared-types';
import { useAnalysisFlow } from '@/hooks/use-analysis-flow';

export function useAnalysisForm() {
  const form = useForm<AnalysisRequest>({
    defaultValues: {
      homeTeam: '',
      awayTeam: '',
      competition: '',
      matchDate: ''
    }
  });
  const analysisFlow = useAnalysisFlow();

  const onSubmit = form.handleSubmit(async (values) => {
    await analysisFlow.submit(values);
  });

  return {
    form,
    onSubmit,
    analysisFlow
  };
}
