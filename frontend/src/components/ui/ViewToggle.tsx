import { Eye, Plus, Grid, X, Minus, Search, User, List } from '@/components/icons';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
        Vista:
      </span>
      <div className="flex border border-outline-variant/40 rounded-lg overflow-hidden">
        <button
          onClick={() => onChange('grid')}
          className={`p-2 transition-colors ${
            view === 'grid'
              ? 'bg-primary text-on-primary'
              : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
          }`}
          aria-label="Vista de cuadrícula"
        >
          <Grid size={20} />
        </button>
        <button
          onClick={() => onChange('list')}
          className={`p-2 transition-colors ${
            view === 'list'
              ? 'bg-primary text-on-primary'
              : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
          }`}
          aria-label="Vista de lista"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}