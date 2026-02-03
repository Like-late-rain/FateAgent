import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          FateAgent
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/dashboard" className="hover:text-tide">
            产品控制台
          </Link>
          <Link href="/dashboard/analysis" className="hover:text-tide">
            赛事分析
          </Link>
          <Link href="/dashboard/history" className="hover:text-tide">
            历史记录
          </Link>
          <Link href="/dashboard/purchase" className="hover:text-tide">
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
