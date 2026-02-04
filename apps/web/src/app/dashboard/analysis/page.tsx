'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalysisForm } from '@/hooks/use-analysis-form';
import { useCredits } from '@/hooks/use-credits';
import { AnalysisForm } from '@/components/analysis/analysis-form';
import { AnalysisResultCard } from '@/components/analysis/analysis-result';
import { AnalysisDisclaimer } from '@/components/analysis/analysis-disclaimer';

export default function AnalysisPage() {
  const { form, onSubmit, analysisFlow } = useAnalysisForm();
  const { state, reset } = analysisFlow;
  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.data?.remainingCredits ?? 0;
  const canSubmit =
    credits > 0 &&
    state.status !== 'submitting' &&
    !creditsQuery.isLoading &&
    !creditsQuery.isError;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>赛事分析</CardTitle>
          <CardDescription>输入比赛信息，系统将生成结构化分析报告。</CardDescription>
        </CardHeader>
      </Card>
      <AnalysisForm
        form={form}
        onSubmit={onSubmit}
        onReset={reset}
        state={state}
        credits={credits}
        canSubmit={canSubmit}
        isLoading={creditsQuery.isLoading}
        isError={creditsQuery.isError}
      />
      <AnalysisResultCard
        status={state.status}
        result={state.status === 'completed' ? state.result : undefined}
        errorMessage={state.status === 'error' ? state.message : undefined}
      />
      <AnalysisDisclaimer />
    </div>
  );
}
