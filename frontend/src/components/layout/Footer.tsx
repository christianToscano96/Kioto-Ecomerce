import { NavLink } from 'react-router-dom';

const footerLinks = [
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
  { to: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="bg-[#f1edd6] dark:bg-[#1c1c12] w-full mt-20 border-t border-dashed border-[#dbc1ba]/40">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 max-w-screen-2xl mx-auto">
        {/* Brand + Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-[#1c1c12] dark:text-[#fdfae9]">KIOTO</h3>
          <p className="text-on-surface-variant text-xs font-body leading-relaxed">
            Crafted for the Earthbound. Boutique organic fashion for those who appreciate the tactile and the timeless.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-primary-container">
            Information
          </h4>
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-[#1c1c12] dark:text-[#fdfae9] text-xs uppercase tracking-[0.1em] hover:translate-x-1 transition-transform duration-200 font-body"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-primary-container">
            Join the Collective
          </h4>
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-outline focus:border-primary focus:ring-0 px-0 py-3 text-xs placeholder:text-outline-variant/60 font-body"
            />
            <button className="absolute right-0 bottom-3 text-primary">
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest">
            © 2024 KIOTO. Crafted for the Earthbound.
          </p>
        </div>
      </div>
    </footer>
  );
}