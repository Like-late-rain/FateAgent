'use client';

import { useRouter } from 'next/navigation';
import type { AnalysisResult } from '@fateagent/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();

  const handleViewDetails = () => {
    if (result?.id) {
      router.push(`/dashboard/analysis/${result.id}`);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {status === 'processing' && (
          <Loading label="正在生成分析结果，请稍候..." />
        )}
        {status === 'error' && errorMessage && (
          <ErrorMessage message={errorMessage} />
        )}
        {status === 'completed' && result && (
          <div className="space-y-4">
            {/* 预测概览 */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">预测结果</p>
                <p className="text-3xl font-semibold">
                  {result.result?.prediction ?? '待定'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">置信度</p>
                <p className="text-2xl font-semibold text-primary">
                  {Math.round((result.result?.confidence ?? 0) * 100)}%
                </p>
              </div>
            </div>

            {/* 胜平负概率预览 */}
            {result.result?.winProbability && (
              <div className="space-y-2">
                <p className="text-sm font-medium">胜平负概率</p>
                <div className="h-6 flex rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-xs"
                    style={{ width: `${Math.round(result.result.winProbability.homeWin * 100)}%` }}
                  >
                    {Math.round(result.result.winProbability.homeWin * 100)}%
                  </div>
                  <div
                    className="bg-yellow-500 flex items-center justify-center text-white text-xs"
                    style={{ width: `${Math.round(result.result.winProbability.draw * 100)}%` }}
                  >
                    {Math.round(result.result.winProbability.draw * 100)}%
                  </div>
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-xs"
                    style={{ width: `${Math.round(result.result.winProbability.awayWin * 100)}%` }}
                  >
                    {Math.round(result.result.winProbability.awayWin * 100)}%
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>主胜</span>
                  <span>平局</span>
                  <span>客胜</span>
                </div>
              </div>
            )}

            {/* 简要分析 */}
            <p className="text-sm text-muted-foreground">
              {result.result?.analysis ?? '暂无分析文本。'}
            </p>

            {/* 关键因素预览 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">关键因素</p>
              <div className="grid gap-2 md:grid-cols-2">
                {result.result?.factors.slice(0, 4).map((factor) => (
                  <div
                    key={factor.name}
                    className={`rounded-md border px-4 py-3 text-sm ${
                      factor.impact === 'positive'
                        ? 'border-green-500/30 bg-green-500/5'
                        : factor.impact === 'negative'
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-yellow-500/30 bg-yellow-500/5'
                    }`}
                  >
                    <p className="font-semibold">{factor.name}</p>
                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 查看详情按钮 */}
            <div className="pt-4 flex justify-center">
              <Button size="lg" onClick={handleViewDetails}>
                查看完整分析报告
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
