'use client';

import { usePathname } from 'next/navigation';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Sidebar } from '@/components/sidebar';
import { Loading } from '@/components/ui/loading';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading, user } = useAuthGuard();

  if (isLoading && !user) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Loading label="正在验证登录状态..." />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[220px_1fr]">
      <Sidebar currentPath={pathname} />
      <div>{children}</div>
    </div>
  );
}
