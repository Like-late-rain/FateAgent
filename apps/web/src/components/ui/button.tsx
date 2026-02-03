import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-ink text-white hover:bg-ink/90 shadow-glow',
    ghost: 'bg-transparent text-ink hover:bg-ink/10',
    outline: 'border border-ink/20 text-ink hover:border-ink'
  } as const;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
