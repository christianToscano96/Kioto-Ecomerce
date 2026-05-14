import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from '@/components/icons';

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
  sparklineData?: Array<{ date: string; value: number }>;
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  variant = 'default',
  sparklineData,
}: MetricCardProps) {
  const changeColors = {
    increase: 'text-green-700 bg-green-100/50',
    stable: 'text-on-surface-variant bg-surface-container-high',
    decrease: 'text-terracota-700 bg-terracota-100/50',
  };

  const sparklineColor = change?.type === 'increase' ? '#10b981' : change?.type === 'decrease' ? '#ef4444' : 'hsl(220 80% 55%)';

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
          {change.type === 'increase' ? (
            <TrendingUp size={12} />
          ) : change.type === 'decrease' ? (
            <TrendingDown size={12} />
          ) : (
            <Minus size={12} />
          )}
          <span>{change.label}</span>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                fill={`url(#gradient-${label.replace(/\s/g, '')})`}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}