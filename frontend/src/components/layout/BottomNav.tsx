import { NavLink } from 'react-router-dom';
import { Home, Search, BookOpen, User } from '@/components/icons';

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  search: Search,
  menu_book: BookOpen,
  person_outline: User,
};

const navItems = [
  { to: '/', icon: 'home', label: 'Inicio' },
  { to: '/search', icon: 'search', label: 'Buscar' },
  { to: '/journal', icon: 'menu_book', label: 'Journal' },
  { to: '/account', icon: 'person_outline', label: 'Cuenta' },
];

export function BottomNav() {
  return (
    <nav className="md:hidden bg-background/90 dark:bg-on-surface/90 backdrop-blur-xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-dashed border-outline-variant/40 px-2 py-3 flex justify-around items-center" role="navigation" aria-label="Navegación móvil">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center font-body text-[10px] uppercase tracking-[0.1em] transition-colors min-h-[44px] min-w-[44px] px-2 ${
                isActive ? 'text-primary scale-110' : 'text-on-surface/40 dark:text-background/40'
              }`
            }
            aria-label={item.label}
          >
            <Icon size={20} className="mb-1" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}