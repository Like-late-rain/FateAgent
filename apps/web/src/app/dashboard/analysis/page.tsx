'use client';

import { Card } from '@/components/ui/card';
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
        <h1 className="font-display text-2xl font-semibold">赛事分析</h1>
        <p className="mt-2 text-sm text-ink/70">
          输入比赛信息，系统将生成结构化分析报告。
        </p>
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
