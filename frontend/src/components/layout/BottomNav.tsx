import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/journal', icon: 'menu_book', label: 'Journal' },
  { to: '/account', icon: 'person_outline', label: 'Account' },
];

export function BottomNav() {
  return (
    <nav className="md:hidden bg-background/90 dark:bg-on-surface/90 backdrop-blur-xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-dashed border-outline-variant/40 px-6 py-4 flex justify-around items-center">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center font-body text-[10px] uppercase tracking-[0.1em] transition-colors ${
              isActive ? 'text-primary scale-110' : 'text-on-surface/40 dark:text-background/40'
            }`
          }
        >
          <span className="material-symbols-outlined mb-1 text-sm">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}