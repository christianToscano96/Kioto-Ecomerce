import { useNavigate } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  description: string;
  linkText?: string;
}

export function SectionHeader({ title, description, linkText = 'Ver Catálogo' }: SectionHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
      <div>
        <h2 className="text-4xl font-serif text-on-surface mb-4">{title}</h2>
        <p className="text-on-surface-variant max-w-sm">{description}</p>
      </div>
      <button
        onClick={() => navigate('/products')}
        className="text-primary border-b border-dashed border-outline-variant pb-1 label-md uppercase tracking-widest hover:border-primary transition-all"
      >
        {linkText}
      </button>
    </div>
  );
}