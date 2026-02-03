'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/use-credits';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

export default function DashboardPage() {
  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.data?.remainingCredits ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="font-display text-2xl font-semibold">控制台概览</h1>
        <p className="mt-2 text-sm text-ink/70">
          管理你的分析任务、剩余次数与购买记录。
        </p>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            剩余次数
          </h2>
          <div className="mt-4">
            {creditsQuery.isLoading && <Loading label="读取次数..." />}
            {creditsQuery.isError && (
              <ErrorMessage message="无法获取次数，请稍后重试。" />
            )}
            {!creditsQuery.isLoading && !creditsQuery.isError && (
              <div className="text-4xl font-semibold text-ink">{credits}</div>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            快捷操作
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/dashboard/analysis">
              <Button className="w-full">开始新分析</Button>
            </Link>
            <Link href="/dashboard/purchase">
              <Button variant="outline" className="w-full">
                购买次数包
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
