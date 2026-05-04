import { NavLink } from 'react-router-dom';

const footerLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/stockists', label: 'Stockists' },
];

export function Footer() {
  return (
    <footer className="bg-background dark:bg-on-surface w-full py-12 border-t border-dashed border-outline-variant/40">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 space-y-4 md:space-y-0 max-w-screen-2xl mx-auto font-body text-sm tracking-wide text-primary">
        <NavLink to="/" className="font-serif text-lg text-on-surface">
          KIOTO
        </NavLink>

        <nav className="flex space-x-8">
          {footerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-on-surface/50 hover:underline decoration-dotted opacity-80 hover:opacity-100"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="text-on-surface/50">© 2024 KIOTO ARCHIVE</div>
      </div>
    </footer>
  );
}