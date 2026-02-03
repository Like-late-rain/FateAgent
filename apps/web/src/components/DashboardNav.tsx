'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV } from '@/utils/constants';

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3">
      {DASHBOARD_NAV.map((item) => {
        const isActive = pathname === item.href;
        const classes = [
          'rounded-full px-4 py-1 text-sm font-medium',
          isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700',
        ].join(' ');
        return (
          <Link key={item.href} href={item.href} className={classes}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
