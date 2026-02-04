import Link from 'next/link';
import { cn } from '@/utils/cn';

const links = [
  { href: '/dashboard', label: '概览' },
  { href: '/dashboard/analysis', label: '赛事分析' },
  { href: '/dashboard/history', label: '历史记录' },
  { href: '/dashboard/purchase', label: '购买次数' }
];

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-full rounded-lg border border-border bg-card p-4 text-card-foreground md:w-56">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        控制台
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              currentPath === link.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
