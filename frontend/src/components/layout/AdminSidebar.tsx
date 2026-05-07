import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const navItems = [
  { to: "/admin", label: "Tablero", icon: "fa-tachometer-alt", exact: true },
  { to: "/admin/products", label: "Productos", icon: "fa-box" },
  { to: "/admin/categories", label: "Categorías", icon: "fa-tags" },
  { to: "/admin/orders", label: "Pedidos", icon: "fa-shopping-bag" },
  { to: "/admin/settings", label: "Configuración", icon: "fa-cog" },
];

export function AdminSidebar() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-background border-r border-outline/40 min-h-screen flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-outline/40">
        <h1 className="text-2xl font-serif font-bold text-on-surface tracking-tight">
          Kioto
        </h1>
        <p className="text-xs text-on-surface-variant/70 font-medium tracking-widest uppercase mt-1">
          Panel de Control
        </p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface hover:text-on-surface",
              )
            }
          >
            <i className={`fa ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-outline/40">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface hover:text-on-surface w-full transition-colors"
        >
          <i className="fa fa-sign-out-alt w-5 text-center"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
