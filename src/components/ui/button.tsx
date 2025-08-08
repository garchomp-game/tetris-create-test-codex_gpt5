import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const variantClasses: Record<string, string> = {
  default: 'bg-[var(--color-primary)] text-white hover:brightness-110',
  primary: 'bg-[var(--color-success)] text-white hover:brightness-110',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-[var(--color-panel-border)] hover:bg-[var(--color-bg)]',
};

const sizeClasses: Record<string, string> = {
  default: 'px-4 py-2',
  sm: 'px-2 py-1 text-sm',
  lg: 'px-6 py-3',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button };
