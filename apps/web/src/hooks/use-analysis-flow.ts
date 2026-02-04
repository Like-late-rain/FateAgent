'use client';

import { useEffect, useState } from 'react';
import type { AnalysisRequest, AnalysisResult } from '@fateagent/shared-types';
import { createAnalysis, fetchAnalysis } from '@/services/analysis';

export type AnalysisPageState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'processing'; analysisId: string }
  | { status: 'completed'; result: AnalysisResult }
  | { status: 'error'; message: string };

export function useAnalysisFlow() {
  const [state, setState] = useState<AnalysisPageState>({ status: 'idle' });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (state.status === 'processing') {
      timer = setInterval(async () => {
        try {
          const res = await fetchAnalysis(state.analysisId);
          if (res.success && res.data?.status === 'completed') {
            setState({ status: 'completed', result: res.data });
          }
          if (res.success && res.data?.status === 'failed') {
            setState({
              status: 'error',
              message: res.data.result?.analysis ?? '分析失败，请稍后重试'
            });
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : '分析结果读取失败';
          setState({ status: 'error', message });
        }
      }, 4000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [state]);

  const submit = async (payload: AnalysisRequest) => {
    setState({ status: 'submitting' });
    try {
      const res = await createAnalysis(payload);
      if (!res.success || !res.data) {
        setState({ status: 'error', message: res.error?.message ?? '提交失败' });
        return;
      }
      if (res.data.status === 'completed') {
        setState({ status: 'completed', result: res.data });
        return;
      }
      setState({ status: 'processing', analysisId: res.data.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交异常';
      setState({ status: 'error', message });
    }
  };

  const reset = () => setState({ status: 'idle' });

  return { state, submit, reset };
}
