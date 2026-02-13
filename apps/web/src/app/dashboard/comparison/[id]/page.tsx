'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Badge } from '@/components/ui/badge';
import { getComparisonResult, autoFetchMatchResult } from '@/services/matchResult';
import { useState } from 'react';

export default function ComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [isAutoFetching, setIsAutoFetching] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => getComparisonResult(id),
    enabled: !!id,
    retry: false
  });

  // 自动抓取 mutation
  const autoFetchMutation = useMutation({
    mutationFn: () => autoFetchMatchResult(id),
    onSuccess: (result) => {
      if (result.success) {
        // 重新加载对比数据
        queryClient.invalidateQueries({ queryKey: ['comparison', id] });
      }
    }
  });

  const handleAutoFetch = async () => {
    setIsAutoFetching(true);
    try {
      await autoFetchMutation.mutateAsync();
    } finally {
      setIsAutoFetching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading label="加载对比结果..." />
      </div>
    );
  }

  if (isError || !data?.success) {
    const errorMsg = (error as any)?.response?.data?.error || data?.error || '加载失败';
    const canCompare = (error as any)?.response?.data?.canCompare || data?.canCompare;

    return (
      <div className="space-y-4">
        <ErrorMessage message={errorMsg} />
        {canCompare && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                比赛结果尚未录入。Agent 可以自动从网络抓取比赛结果，或者您也可以手动录入。
              </p>
              {autoFetchMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  自动抓取失败：{(autoFetchMutation.error as any)?.error || '未知错误'}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleAutoFetch}
                  disabled={isAutoFetching || autoFetchMutation.isPending}
                >
                  {isAutoFetching || autoFetchMutation.isPending ? '抓取中...' : '🤖 自动抓取结果'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/record-result/${id}`)}
                >
                  手动录入结果
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <Button variant="outline" onClick={() => router.back()}>返回</Button>
      </div>
    );
  }

  const { matchInfo, prediction, actualResult, comparison } = data.data;

  // 计算预测结果展示
  const outcomeMap = {
    homeWin: '主胜',
    draw: '平局',
    awayWin: '客胜'
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{matchInfo.competition}</p>
              <CardTitle className="text-2xl">
                {matchInfo.homeTeam} vs {matchInfo.awayTeam}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                比赛日期：{matchInfo.matchDate}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              返回
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 综合评分 */}
      <Card>
        <CardHeader>
          <CardTitle>预测准确度评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {comparison.accuracyScore}
              </div>
              <div className="text-lg text-muted-foreground">综合评分（满分 100）</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 胜负对比 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>胜负预测</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Agent 预测</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{outcomeMap[comparison.predictedOutcome]}</span>
                <Badge variant={comparison.outcomeCorrect ? 'default' : 'destructive'}>
                  {comparison.outcomeCorrect ? '✓ 正确' : '✗ 错误'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                置信度：{(comparison.outcomeProbability * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">实际结果</p>
              <span className="text-2xl font-bold">{outcomeMap[comparison.actualOutcome]}</span>
            </div>
          </CardContent>
        </Card>

        {/* 比分对比 */}
        <Card>
          <CardHeader>
            <CardTitle>比分预测</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">实际比分</p>
              <span className="text-2xl font-bold">
                {actualResult.homeScore} - {actualResult.awayScore}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">预测准确性</p>
              <div className="space-y-2">
                {comparison.exactScoreCorrect && (
                  <Badge variant="default">✓ 精确命中</Badge>
                )}
                {!comparison.exactScoreCorrect && comparison.scoreInTop5 && (
                  <Badge variant="secondary">
                    在 TOP 5 预测中（第 {comparison.scoreRank} 位）
                  </Badge>
                )}
                {!comparison.scoreInTop5 && (
                  <Badge variant="destructive">✗ 未在 TOP 5 中</Badge>
                )}
              </div>
            </div>
            {prediction.scorePredictions && prediction.scorePredictions.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Agent 的 TOP 5 预测</p>
                <div className="space-y-1">
                  {prediction.scorePredictions.slice(0, 5).map((pred: any, idx: number) => (
                    <div
                      key={idx}
                      className={`text-sm flex justify-between ${
                        pred.score === `${actualResult.homeScore}-${actualResult.awayScore}`
                          ? 'font-bold text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span>#{idx + 1} {pred.score}</span>
                      <span>{(pred.probability * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 进球数预测对比 */}
      {(comparison.overUnderCorrect !== undefined || comparison.bothTeamsScoreCorrect !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle>进球数预测</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {comparison.overUnderCorrect !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">大小球 2.5</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {actualResult.totalGoals > 2.5 ? '大球' : '小球'}
                    </span>
                    <Badge variant={comparison.overUnderCorrect ? 'default' : 'destructive'}>
                      {comparison.overUnderCorrect ? '✓ 正确' : '✗ 错误'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    实际总进球数：{actualResult.totalGoals}
                  </p>
                </div>
              )}
              {comparison.bothTeamsScoreCorrect !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">双方进球</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {actualResult.homeScore > 0 && actualResult.awayScore > 0 ? '是' : '否'}
                    </span>
                    <Badge variant={comparison.bothTeamsScoreCorrect ? 'default' : 'destructive'}>
                      {comparison.bothTeamsScoreCorrect ? '✓ 正确' : '✗ 错误'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细分析 */}
      <Card>
        <CardHeader>
          <CardTitle>详细对比分析</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Agent 的原始分析</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {prediction.analysis}
            </p>
          </div>

          {prediction.factors && prediction.factors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Agent 考虑的关键因素</h4>
              <div className="space-y-2">
                {prediction.factors.map((factor: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Badge
                      variant={
                        factor.impact === 'positive'
                          ? 'default'
                          : factor.impact === 'negative'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="mt-0.5"
                    >
                      {factor.impact === 'positive' ? '利好' : factor.impact === 'negative' ? '利空' : '中性'}
                    </Badge>
                    <div>
                      <p className="font-medium">{factor.name}</p>
                      <p className="text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 查看原始分析 */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={() => router.push(`/dashboard/analysis/${id}`)}>
            查看完整分析详情
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
