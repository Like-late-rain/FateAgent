import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PrimaryButton({ children, className, ...rest }: PrimaryButtonProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white',
    'transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300',
    className ?? '',
  ].join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
