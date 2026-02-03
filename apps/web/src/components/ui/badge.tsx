import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/70',
        className
      )}
      {...props}
    />
  );
}
