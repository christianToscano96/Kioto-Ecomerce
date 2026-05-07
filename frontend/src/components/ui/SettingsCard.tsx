import { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <div className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        {description && (
          <p className="text-sm text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}