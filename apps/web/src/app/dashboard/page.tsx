'use client';

import Link from 'next/link';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCredits } from '@/hooks/useCredits';
import { useUserStore } from '@/stores/userStore';

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.data?.remainingCredits;

  return (
    <div className="space-y-6">
      <Card
        title={`欢迎回来${user?.nickname ? `，${user.nickname}` : ''}`}
        description="在这里查看你的分析概览与剩余次数。"
      >
        {creditsQuery.isLoading ? (
          <p className="text-sm text-slate-500">正在加载剩余次数...</p>
        ) : (
          <p className="text-sm text-slate-600">剩余次数：{credits ?? '—'}</p>
        )}
      </Card>
      <Card title="快速开始" description="选择接下来的操作。">
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/analysis">
            <PrimaryButton>发起分析</PrimaryButton>
          </Link>
          <Link href="/dashboard/purchase">
            <PrimaryButton className="bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
              购买次数
            </PrimaryButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}
