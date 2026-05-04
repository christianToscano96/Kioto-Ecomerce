import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-verde-bosque-100 text-verde-bosque-800',
    secondary: 'bg-arena-100 text-arena-800',
    success: 'bg-verde-bosque-600 text-white',
    warning: 'bg-terracota-100 text-terracota-800',
    destructive: 'bg-terracota-600 text-white',
    outline: 'border border-chocolate-300 text-chocolate-700 bg-transparent',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </span>
  );
}