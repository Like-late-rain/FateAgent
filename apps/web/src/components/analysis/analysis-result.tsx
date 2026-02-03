import type { AnalysisResult } from '@fateagent/shared-types';
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface AnalysisResultProps {
  status: 'idle' | 'submitting' | 'processing' | 'completed' | 'error';
  result?: AnalysisResult;
  errorMessage?: string;
}

export function AnalysisResultCard({
  status,
  result,
  errorMessage
}: AnalysisResultProps) {
  return (
    <Card>
      {status === 'processing' && (
        <Loading label="正在生成分析结果，请稍候..." />
      )}
      {status === 'error' && errorMessage && (
        <ErrorMessage message={errorMessage} />
      )}
      {status === 'completed' && result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink/60">预测结果</p>
              <p className="text-3xl font-semibold text-ink">
                {result.result?.prediction ?? '待定'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink/60">置信度</p>
              <p className="text-2xl font-semibold text-tide">
                {Math.round((result.result?.confidence ?? 0) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-sm text-ink/70">
            {result.result?.analysis ?? '暂无分析文本。'}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">关键因素</p>
            <div className="grid gap-2 md:grid-cols-2">
              {result.result?.factors.map((factor) => (
                <div
                  key={factor.name}
                  className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm"
                >
                  <p className="font-semibold">{factor.name}</p>
                  <p className="text-ink/60">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
