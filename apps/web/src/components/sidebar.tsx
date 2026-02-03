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
    <aside className="w-full rounded-3xl border border-white/60 bg-white/60 p-4 shadow-glow backdrop-blur md:w-56">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
        控制台
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-2xl px-4 py-2 text-sm font-medium transition',
              currentPath === link.href
                ? 'bg-ink text-white'
                : 'text-ink/70 hover:bg-ink/10'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
