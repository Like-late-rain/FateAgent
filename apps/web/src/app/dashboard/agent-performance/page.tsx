'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { getAgentPerformance } from '@/services/matchResult';
import { AgentRadarChart } from '@/components/agent/agent-radar-chart';
import { AgentStatsGrid } from '@/components/agent/agent-stats-grid';

export default function AgentPerformancePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['agent-performance'],
    queryFn: getAgentPerformance
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading label="加载 Agent 性能数据..." />
      </div>
    );
  }

  if (isError || !data?.success) {
    return <ErrorMessage message="加载失败" />;
  }

  const metrics = data.data;

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <Card>
        <CardHeader>
          <CardTitle>Agent 性能分析</CardTitle>
          <CardDescription>
            查看 Agent 的预测准确率和各项性能指标
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 总体统计 */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">总预测次数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.verifiedPredictions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已验证的预测
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">综合评分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {metrics.overallScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              满分 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">胜负预测</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {(metrics.outcomeAccuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              准确率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">比分命中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {(metrics.exactScoreAccuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              精确比分
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle>能力雷达图</CardTitle>
          <CardDescription>
            Agent 在各个维度的预测能力评估
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.verifiedPredictions > 0 ? (
            <AgentRadarChart metrics={metrics} />
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground">
                暂无数据，请先录入比赛结果以生成性能分析
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详细统计 */}
      <Card>
        <CardHeader>
          <CardTitle>详细统计</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentStatsGrid metrics={metrics} />
        </CardContent>
      </Card>

      {/* 说明 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📊 <strong>综合评分</strong>：基于胜负预测（40分）+ 比分预测（30分）+ 进球数预测（30分）的加权平均</p>
            <p>🎯 <strong>胜负预测准确率</strong>：预测主胜/平局/客胜的准确性</p>
            <p>⚽ <strong>比分命中率</strong>：精确预测比分的准确性</p>
            <p>📈 <strong>TOP 5 命中率</strong>：实际比分出现在预测 TOP 5 中的比率</p>
            <p>🔢 <strong>大小球准确率</strong>：预测总进球数大于/小于 2.5 球的准确性</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
