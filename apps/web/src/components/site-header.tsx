import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold">
          FateAgent
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            产品控制台
          </Link>
          <Link href="/dashboard/analysis" className="text-muted-foreground hover:text-foreground">
            赛事分析
          </Link>
          <Link href="/dashboard/history" className="text-muted-foreground hover:text-foreground">
            历史记录
          </Link>
          <Link href="/dashboard/purchase" className="text-muted-foreground hover:text-foreground">
            购买次数
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link href="/register">
            <Button>注册</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
