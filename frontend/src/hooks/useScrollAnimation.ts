import { useEffect, useRef } from 'react';

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function useStaggeredScrollAnimation(itemCount: number, staggerDelay = 100) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elements.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              entry.target.classList.add('animate-in');
              (entry.target as HTMLElement).style.animationDelay = `${index * staggerDelay}ms`;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [staggerDelay]);

  return refs;
}