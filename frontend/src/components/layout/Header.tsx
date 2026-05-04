import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Collections' },
  { to: '/archive', label: 'Archive' },
  { to: '/about', label: 'Our Story' },
];

export function Header() {
  return (
    <header className="bg-background/80 dark:bg-on-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-dashed border-outline-variant/40">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <NavLink 
          to="/" 
          className="text-2xl font-serif uppercase tracking-[0.2em] text-on-surface dark:text-background"
        >
          KIOTO
        </NavLink>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-12 font-serif tracking-tight">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-on-surface/60 dark:text-background/60 hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6 text-primary">
          <button className="hover:text-primary/80 transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="hover:text-primary/80 transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>
    </header>
  );
}