import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Icon } from "@/components/icons";
import {
  BarChart3,
  Package,
  Tags,
  ClipboardList,
  Settings,
  LogOut,
} from "@/components/icons";

const navItems = [
  { to: "/admin", label: "Tablero", icon: BarChart3, exact: true },
  { to: "/admin/products", label: "Productos", icon: Package },
  { to: "/admin/categories", label: "Categorías", icon: Tags },
  { to: "/admin/orders", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/settings", label: "Configuración", icon: Settings },
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
      <div className="p-6 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-on-surface tracking-tight">
              Kioto
            </h1>
            <p className="text-xs text-on-surface-variant/70 font-medium tracking-widest uppercase mt-1">
              Panel de Control
            </p>
          </div>
        </div>
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
            {item.icon && (
              <span className="shrink-0 text-inherit">
                <Icon icon={item.icon} size={24} />
              </span>
            )}
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
          <span className="shrink-0 text-inherit">
            <Icon icon={LogOut} size={24} />
          </span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
