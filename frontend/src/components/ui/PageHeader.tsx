interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-12">
      {eyebrow && (
        <span className="label-md uppercase tracking-[0.2em] text-primary text-xs font-bold">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl font-serif font-bold text-on-surface mt-2">{title}</h2>
      {description && (
        <p className="text-on-surface-variant font-body mt-2 max-w-2xl">{description}</p>
      )}
    </div>
  );
}