import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/dashboard/analysis', label: '赛事分析' },
  { href: '/dashboard/history', label: '历史记录' },
  { href: '/pricing', label: '购买次数' }
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
            ⚽️
          </span>
          足球智析
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-2 py-1 text-xs font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              登录
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">免费注册</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
