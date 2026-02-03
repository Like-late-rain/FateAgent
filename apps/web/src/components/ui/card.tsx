import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
