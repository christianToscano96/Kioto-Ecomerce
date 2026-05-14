import { Link } from 'react-router-dom';
import type { Category } from '../../../../shared/src/index';

interface CategoryItemProps {
  category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
  return (
    <Link
      key={category._id}
      to={`/products?category=${category.name}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-2xl  transition-all duration-500  flex-shrink-0 relative overflow-hidden"
    >
      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

      {/* Category image circle */}
      <div className="w-16 h-16 bg-gradient-to-br from-primary-container to-primary rounded-full flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-500 ease-out relative z-10">
        {/* Expanding ring effect */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />

        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="material-symbols-outlined text-2xl text-on-primary group-hover:rotate-12 transition-transform duration-500">
            category
          </span>
        )}
      </div>

      {/* Category name */}
      <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors duration-300 text-center max-w-[80px] truncate">
        {category.name}
      </span>
    </Link>
  );
}