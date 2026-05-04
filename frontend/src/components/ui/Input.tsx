import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 11)}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface',
            'placeholder:text-on-surface-variant',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-terracota-500 focus:ring-terracota-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-terracota-600">{error}</span>}
      </div>
    );
  }
);