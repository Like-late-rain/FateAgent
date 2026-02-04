'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <CardHeader>
          <CardTitle>控制台概览</CardTitle>
          <CardDescription>管理你的分析任务、剩余次数与购买记录。</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>剩余次数</CardDescription>
          </CardHeader>
          <CardContent>
            {creditsQuery.isLoading && <Loading label="读取次数..." />}
            {creditsQuery.isError && (
              <ErrorMessage message="无法获取次数，请稍后重试。" />
            )}
            {!creditsQuery.isLoading && !creditsQuery.isError && (
              <div className="text-3xl font-semibold">{credits}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>快捷操作</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/dashboard/analysis">
              <Button className="w-full">开始新分析</Button>
            </Link>
            <Link href="/dashboard/purchase">
              <Button variant="outline" className="w-full">
                购买次数包
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
