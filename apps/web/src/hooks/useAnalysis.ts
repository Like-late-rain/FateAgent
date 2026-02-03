import { useState } from 'react';
import type { AnalysisRequest, AnalysisResult } from '@fateagent/shared-types';
import { createAnalysis } from '@/services/analysis';
import { API_ERROR_MESSAGES, DEFAULT_DISCLAIMER } from '@/utils/constants';

export type AnalysisPageState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'processing'; analysisId: string }
  | { status: 'completed'; result: AnalysisResult }
  | { status: 'error'; message: string };

export function useAnalysis() {
  const [state, setState] = useState<AnalysisPageState>({ status: 'idle' });

  const submit = async (payload: AnalysisRequest) => {
    setState({ status: 'submitting' });
    try {
      const response = await createAnalysis(payload);
      if (!response.success || !response.data) {
        setState({ status: 'error', message: response.error?.message ?? API_ERROR_MESSAGES.unknown });
        return;
      }
      const result = response.data;
      if (result.status === 'processing' || result.status === 'pending') {
        setState({ status: 'processing', analysisId: result.id });
        return;
      }
      setState({ status: 'completed', result: { ...result, disclaimer: result.disclaimer || DEFAULT_DISCLAIMER } });
    } catch (error) {
      const message = error instanceof Error ? error.message : API_ERROR_MESSAGES.unknown;
      setState({ status: 'error', message });
    }
  };

  return {
    state,
    submit,
    reset: () => setState({ status: 'idle' }),
  };
}
