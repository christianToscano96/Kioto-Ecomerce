import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCartItemCount } from "@/store/cart";

const navItems = [
  { to: "/products", label: "Shop All" },
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/new", label: "New Arrivals" },
];

export function Header() {
  const cartItemCount = useCartItemCount();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-dashed border-outline-variant/40">
      <div className="max-w-7xl mx-auto  py-4 flex justify-between items-center">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="font-serif text-2xl font-bold tracking-widest text-on-surface"
          >
            KIOTO
          </NavLink>
          <div className="hidden md:flex items-center gap-8 font-serif text-lg tracking-tight">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-on-surface/80 hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right: Search + Cart */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-lg border border-transparent focus-within:border-outline transition-all"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs placeholder:text-on-surface-variant/50 w-36 font-label"
            />
          </form>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="text-primary relative scale-95 active:opacity-80 transition-transform"
          >
            <span
              className="material-symbols-outlined"
              data-icon="shopping_cart"
            >
              shopping_cart
            </span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
