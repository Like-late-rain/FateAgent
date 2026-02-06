'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { getAnalysis } from '@/services/analysis';
import { recordMatchResult } from '@/services/matchResult';

export default function RecordResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  // 获取分析记录
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => getAnalysis(id),
    enabled: !!id
  });

  // 录入结果 mutation
  const recordMutation = useMutation({
    mutationFn: () => recordMatchResult(id, parseInt(homeScore), parseInt(awayScore)),
    onSuccess: (data) => {
      if (data.success) {
        router.push(`/dashboard/comparison/${id}`);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const home = parseInt(homeScore);
    const away = parseInt(awayScore);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      alert('请输入有效的比分');
      return;
    }

    recordMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading label="加载中..." />
      </div>
    );
  }

  if (!analysis?.success || !analysis.data) {
    return <ErrorMessage message="分析记录不存在" />;
  }

  const matchInfo = analysis.data.matchInfo;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>录入比赛结果</CardTitle>
          <CardDescription>
            请输入比赛的实际结果，帮助 Agent 学习和改进预测能力
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <p className="text-sm text-muted-foreground">{matchInfo.competition}</p>
            <CardTitle className="text-xl">
              {matchInfo.homeTeam} vs {matchInfo.awayTeam}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              比赛日期：{matchInfo.matchDate}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="homeScore">主队比分（{matchInfo.homeTeam}）</Label>
                <Input
                  id="homeScore"
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayScore">客队比分（{matchInfo.awayTeam}）</Label>
                <Input
                  id="awayScore"
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {recordMutation.isError && (
              <ErrorMessage
                message={
                  (recordMutation.error as any)?.error ||
                  '录入失败，请稍后重试'
                }
              />
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={recordMutation.isPending}>
                {recordMutation.isPending ? '录入中...' : '确认录入'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 提示：录入比赛结果后，系统会自动分析 Agent 的预测准确性，并生成学习记录帮助 Agent 改进。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
