import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary',
    secondary: 'bg-terracota-100 text-terracota-800 hover:bg-terracota-200 focus-visible:ring-terracota-500',
    ghost: 'text-primary hover:bg-primary/10 focus-visible:ring-primary',
    outline: 'border border-outline bg-transparent text-on-surface-variant hover:bg-surface-container focus-visible:ring-primary',
    destructive: 'bg-terracota-600 text-white hover:bg-terracota-700 focus-visible:ring-terracota-500',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}