'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalysisFlow } from '@/hooks/use-analysis-flow';
import { useParseQuery } from '@/hooks/use-parse-query';
import { useCredits } from '@/hooks/use-credits';
import { AnalysisForm } from '@/components/analysis/analysis-form';
import { AnalysisResultCard } from '@/components/analysis/analysis-result';
import { AnalysisDisclaimer } from '@/components/analysis/analysis-disclaimer';

export default function AnalysisPage() {
  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.data?.remainingCredits ?? 0;

  const parseQuery = useParseQuery();
  const analysisFlow = useAnalysisFlow();

  const handleReset = () => {
    parseQuery.reset();
    analysisFlow.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>赛事分析</CardTitle>
          <CardDescription>
            用自然语言描述您想分析的比赛，AI 将自动解析并生成预测报告。
          </CardDescription>
        </CardHeader>
      </Card>
      <AnalysisForm
        credits={credits}
        isLoading={creditsQuery.isLoading}
        isError={creditsQuery.isError}
        parseState={parseQuery.state}
        analysisState={analysisFlow.state}
        onParse={parseQuery.parse}
        onConfirm={analysisFlow.submit}
        onReset={handleReset}
        onEditParsed={parseQuery.editParsed}
      />
      <AnalysisResultCard
        status={analysisFlow.state.status}
        result={analysisFlow.state.status === 'completed' ? analysisFlow.state.result : undefined}
        errorMessage={analysisFlow.state.status === 'error' ? analysisFlow.state.message : undefined}
      />
      <AnalysisDisclaimer />
    </div>
  );
}
