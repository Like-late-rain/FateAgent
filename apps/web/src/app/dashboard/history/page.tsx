'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAnalysisHistory } from '@/hooks/use-analysis-history';

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus');
  const { query, page, setPage, hasMore } = useAnalysisHistory();
  const items = query.data?.data?.items ?? [];
  const focusItem = items.find((item) => item.id === focusId);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="font-display text-2xl font-semibold">历史记录</h1>
        <p className="mt-2 text-sm text-ink/70">按时间倒序查看已生成的分析。</p>
      </Card>
      <Card>
        {query.isLoading && <Loading label="加载历史记录..." />}
        {query.isError && <ErrorMessage message="加载失败，请稍后重试。" />}
        {!query.isLoading && items.length === 0 && (
          <p className="text-sm text-ink/60">暂无历史记录。</p>
        )}
        {focusItem && (
          <div className="mb-6 rounded-2xl border border-ink/10 bg-white/80 p-4">
            <p className="text-sm text-ink/60">详情</p>
            <p className="mt-2 font-semibold">
              {focusItem.matchInfo.homeTeam} vs {focusItem.matchInfo.awayTeam}
            </p>
            <p className="text-xs text-ink/60">
              {focusItem.matchInfo.competition} · {focusItem.matchInfo.matchDate}
            </p>
            <p className="mt-3 text-sm text-ink/70">
              {focusItem.result?.analysis ?? '暂无分析内容。'}
            </p>
          </div>
        )}
        <div className="mt-4 grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3"
            >
              <div>
                <p className="font-semibold">
                  {item.matchInfo.homeTeam} vs {item.matchInfo.awayTeam}
                </p>
                <p className="text-xs text-ink/60">
                  {item.matchInfo.competition} · {item.matchInfo.matchDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink/60">{item.status}</span>
                <Link href={`/dashboard/history?focus=${item.id}`}>
                  <Button variant="outline">查看详情</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
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
      </Card>
    </div>
  );
}
