import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCartItemCount } from "@/store/cart";
import { api } from "@/lib/api";
import logoK from '../../../assets/logo.png';

const navItems = [
  { to: "/products", label: "Catálogo" },
];

export function Header() {
  const cartItemCount = useCartItemCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch store logo from settings
    api.get('/settings').then(res => {
      if (res.data?.store?.logo) {
        setStoreLogo(res.data.store.logo);
      }
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-dashed border-outline-variant/40">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="flex items-center"
          >
            <div className="h-10 overflow-hidden flex items-center pt-5">
            <img 
              src={storeLogo || logoK} 
              alt="Store Logo" 
              className="h-40 w-auto -mt-2 object-contain "
              style={{marginLeft: '-30px'}}
            />
          </div>
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
              placeholder="Buscar..."
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
