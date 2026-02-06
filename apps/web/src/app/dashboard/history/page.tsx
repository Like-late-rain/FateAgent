'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAnalysisHistory } from '@/hooks/use-analysis-history';

// 判断比赛是否已结束（比赛日期 < 今天）
function isMatchCompleted(matchDate: string): boolean {
  const match = new Date(matchDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return match < today;
}

export default function HistoryPage() {
  const { query, page, setPage, hasMore } = useAnalysisHistory();
  const items = query.data?.data?.items ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>历史记录</CardTitle>
          <CardDescription>按时间倒序查看已生成的分析。</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          {query.isLoading && <Loading label="加载历史记录..." />}
          {query.isError && <ErrorMessage message="加载失败，请稍后重试。" />}
          {!query.isLoading && items.length === 0 && (
            <p className="text-sm text-muted-foreground">暂无历史记录。</p>
          )}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3"
              >
                <div>
                  <p className="font-semibold">
                    {item.matchInfo.homeTeam} vs {item.matchInfo.awayTeam}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.matchInfo.competition} · {item.matchInfo.matchDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '处理中' : item.status}
                  </span>
                  <Link href={`/dashboard/analysis/${item.id}`}>
                    <Button variant="outline" size="sm">
                      查看详情
                    </Button>
                  </Link>
                  {item.status === 'completed' && isMatchCompleted(item.matchInfo.matchDate) && (
                    <Link href={`/dashboard/comparison/${item.id}`}>
                      <Button variant="secondary" size="sm">
                        结果对比
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
            >
              下一页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
