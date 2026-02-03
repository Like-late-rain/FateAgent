'use client';

import { Card } from '@/components/Card';
import { useHistory } from '@/hooks/useHistory';

export default function HistoryPage() {
  const historyQuery = useHistory();
  const items = historyQuery.data?.data?.items ?? [];

  return (
    <Card title="分析历史" description="按时间倒序查看分析记录。">
      {historyQuery.isLoading ? <p className="text-sm text-slate-500">加载中...</p> : null}
      {historyQuery.isError ? <p className="text-sm text-red-500">加载失败，请稍后再试。</p> : null}
      {!historyQuery.isLoading && items.length === 0 ? (
        <p className="text-sm text-slate-500">暂无分析记录。</p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-slate-200 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              {item.matchInfo.homeTeam} vs {item.matchInfo.awayTeam}
            </p>
            <p>状态：{item.status}</p>
            <p>日期：{item.matchInfo.matchDate}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
