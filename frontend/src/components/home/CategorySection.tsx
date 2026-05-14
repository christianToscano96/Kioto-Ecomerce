import type { Category } from '../../../../shared/src/index';
import { CategoryItem } from './CategoryItem';

interface CategorySectionProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export function CategorySection({
  categories,
  title = 'Explorá por Categorías',
  subtitle = 'Encontrá lo que buscás en nuestras colecciones',
}: CategorySectionProps) {
  if (!categories?.length) {
    return null;
  }

  return (
    <section className="bg-surface py-10 border-b border-outline-variant/10 animate-on-scroll">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">{title}</h2>
        <p className="text-on-surface-variant text-sm">{subtitle}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center stagger-children">
        {categories.map((category) => (
          <CategoryItem key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
}