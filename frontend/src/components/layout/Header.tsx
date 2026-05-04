import { NavLink } from "react-router-dom";
import { useCartItemCount } from "@/hooks/useCart";

const navItems = [
  { to: "/products", label: "Catálogo" },
  { to: "/men", label: "Hombre" },
  { to: "/women", label: "Mujer" },
  { to: "/new", label: "Novedades" },
];

export function Header() {
  const cartItemCount = useCartItemCount();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fdfae9]/80  backdrop-blur-xl shadow-[0_40px_40px_rgba(28,28,18,0.04)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-12">
          <NavLink
            to="/"
            className="text-2xl font-serif tracking-tight text-[#1c1c12] dark:text-[#1c1c12]"
          >
            KIOTO
          </NavLink>
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-[#1c1c12] border-b border-dashed border-transparent pb-1 text-xs uppercase tracking-[0.1em] font-body hover:border-[#99452c] hover:text-[#99452c] transition-all duration-300"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

{/* Right: Actions */}
        <div className="flex items-center gap-6">
          <button className="text-[#1c1c12] active:scale-[0.99] transition-transform">
            <span className="material-symbols-outlined" data-icon="search">search</span>
          </button>
          <NavLink 
            to="/cart" 
            className="text-[#1c1c12] active:scale-[0.99] transition-transform relative"
          >
            <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
