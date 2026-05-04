import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    type?: 'increase' | 'stable' | 'decrease';
  };
  icon?: ReactNode;
  variant?: 'primary' | 'default';
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  variant = 'default',
}: MetricCardProps) {
  const changeColors = {
    increase: 'text-green-700 bg-green-100/50',
    stable: 'text-on-surface-variant bg-surface-container-high',
    decrease: 'text-terracota-700 bg-terracota-100/50',
  };

  return (
    <div
      className={cn(
        'bg-surface-container-low p-8 rounded-lg border-l-2 relative overflow-hidden group hover:bg-surface-container transition-all',
        variant === 'primary' ? 'border-primary' : 'border-outline-variant'
      )}
    >
      {icon && (
        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      )}
      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-1">
        {label}
      </p>
      <p
        className={cn(
          'text-3xl font-serif font-bold',
          variant === 'primary' ? 'text-primary' : 'text-on-surface'
        )}
      >
        {value}
      </p>
      {change && (
        <div
          className={cn(
            'flex items-center gap-1 mt-4 text-[10px] w-fit px-2 py-0.5 rounded-full',
            changeColors[change.type || 'stable']
          )}
        >
          <span className="material-symbols-outlined text-xs">
            {change.type === 'increase' ? 'trending_up' : change.type === 'decrease' ? 'trending_down' : 'remove'}
          </span>
          <span>{change.label}</span>
        </div>
      )}
    </div>
  );
}