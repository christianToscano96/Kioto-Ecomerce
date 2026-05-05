import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'main' | 'section';
}

/**
 * Consistent container for all pages
 * Provides unified padding and max-width across the application
 */
export function Container({ children, className = '', as = 'div' }: ContainerProps) {
  const Component = as;
  
  return (
    <Component className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Page Container - specifically for page content
 * Adds vertical padding for breathing room
 */
export function PageContainer({ children, className = '' }: Omit<ContainerProps, 'as'>) {
  return (
    <main className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}