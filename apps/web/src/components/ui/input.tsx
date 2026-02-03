import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-ink/15 bg-white/80 px-4 text-sm outline-none ring-offset-2 focus:border-tide focus:ring-2 focus:ring-tide/30',
        className
      )}
      {...props}
    />
  );
}
