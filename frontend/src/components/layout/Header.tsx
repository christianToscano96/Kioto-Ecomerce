import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCartItemCount } from "@/store/cart";
import { useCategoriesStore } from "@/store/categories";
import { useSettings } from "@/lib/queries";
import logoK from '../../../assets/logo.png';

const navItems = [
  { to: "/products", label: "Catálogo" },
];

export function Header() {
  const cartItemCount = useCartItemCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const { categories, fetchCategories } = useCategoriesStore();
  const navigate = useNavigate();
  
  // React Query for settings (avoids duplicate API calls)
  const { data: settings } = useSettings();
  const storeLogo = settings?.store?.logo;

  useEffect(() => {
    fetchCategories();
    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [fetchCategories, closeTimeout]);

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
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => {
                  if (closeTimeout) clearTimeout(closeTimeout);
                  item.to === "/products" && setShowCategoryDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setShowCategoryDropdown(false), 300);
                  setCloseTimeout(timeout);
                }}
              >
                <NavLink
                  to={item.to}
                  className="text-on-surface/80 hover:text-primary transition-colors duration-300 flex items-center gap-1"
                >
                  {item.label}
                  {item.to === "/products" && (
                    <span className="material-symbols-outlined text-xs">expand_more</span>
                  )}
                </NavLink>
              </div>
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

      {/* Category Dropdown Mega Menu */}
      {showCategoryDropdown && categories && categories.length > 0 && (
        <div 
          className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-outline-variant/40 shadow-lg"
          onMouseEnter={() => {
            if (closeTimeout) clearTimeout(closeTimeout);
            setShowCategoryDropdown(true);
          }}
          onMouseLeave={() => {
            const timeout = setTimeout(() => setShowCategoryDropdown(false), 300);
            setCloseTimeout(timeout);
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 max-h-80 overflow-y-auto scrollbar-hide pr-2">
              {categories.map((category) => (
                <NavLink
                  key={category._id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  <div className="w-16 h-16 bg-surface-container rounded-full overflow-hidden mb-2 group-hover:shadow-md transition-shadow mx-auto">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-xl">{category.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors text-center block truncate">
                    {category.name}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
