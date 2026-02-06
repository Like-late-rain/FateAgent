'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { getAnalysis } from '@/services/analysis';
import { WinProbabilityChart } from '@/components/analysis/win-probability-chart';
import { ScorePredictions } from '@/components/analysis/score-predictions';
import { GoalsPrediction } from '@/components/analysis/goals-prediction';
import { TeamAnalysisCard } from '@/components/analysis/team-analysis-card';
import { FactorsList } from '@/components/analysis/factors-list';
import { AnalysisDisclaimer } from '@/components/analysis/analysis-disclaimer';

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => getAnalysis(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading label="加载分析结果..." />
      </div>
    );
  }

  if (isError || !data?.success || !data.data) {
    return (
      <div className="space-y-4">
        <ErrorMessage message="加载分析结果失败" />
        <Button onClick={() => router.back()}>返回</Button>
      </div>
    );
  }

  const analysis = data.data;
  const result = analysis.result;

  return (
    <div className="space-y-6">
      {/* 顶部概览 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{analysis.matchInfo.competition}</p>
              <CardTitle className="text-2xl">
                {analysis.matchInfo.homeTeam} vs {analysis.matchInfo.awayTeam}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                比赛日期：{analysis.matchInfo.matchDate}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              返回
            </Button>
          </div>
        </CardHeader>
      </Card>

      {result && (
        <>
          {/* 预测结果和胜率 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 预测结果 */}
            <Card>
              <CardHeader>
                <CardTitle>预测结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-5xl font-bold text-primary">
                    {result.prediction}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    置信度：<span className="text-primary font-semibold">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 胜平负概率 */}
            {result.winProbability && (
              <WinProbabilityChart
                homeTeam={analysis.matchInfo.homeTeam}
                awayTeam={analysis.matchInfo.awayTeam}
                probability={result.winProbability}
              />
            )}
          </div>

          {/* 分析文本 */}
          <Card>
            <CardHeader>
              <CardTitle>综合分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {result.analysis}
              </p>
            </CardContent>
          </Card>

          {/* 比分预测和进球预测 */}
          <div className="grid gap-6 md:grid-cols-2">
            {result.scorePredictions && result.scorePredictions.length > 0 && (
              <ScorePredictions predictions={result.scorePredictions} />
            )}
            {result.goalsPrediction && (
              <GoalsPrediction prediction={result.goalsPrediction} />
            )}
          </div>

          {/* 球队分析 */}
          {(result.homeTeamAnalysis || result.awayTeamAnalysis) && (
            <div className="grid gap-6 md:grid-cols-2">
              {result.homeTeamAnalysis && (
                <TeamAnalysisCard
                  team={result.homeTeamAnalysis}
                  label="主队"
                />
              )}
              {result.awayTeamAnalysis && (
                <TeamAnalysisCard
                  team={result.awayTeamAnalysis}
                  label="客队"
                />
              )}
            </div>
          )}

          {/* 关键因素 */}
          <FactorsList factors={result.factors} />

          {/* 历史交锋 */}
          {result.headToHead && result.headToHead.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>历史交锋</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.headToHead.map((record, index) => (
                    <div
                      key={index}
                      className="text-sm text-muted-foreground py-2 border-b last:border-0"
                    >
                      {record}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 数据来源 */}
          {result.dataSources && result.dataSources.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">
                  数据来源：{result.dataSources.join('、')}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* 免责声明 */}
      <AnalysisDisclaimer />
    </div>
  );
}
