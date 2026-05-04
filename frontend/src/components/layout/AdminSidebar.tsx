import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "fa-tachometer-alt", exact: true },
  { to: "/admin/products", label: "Products", icon: "fa-box" },
  { to: "/admin/orders", label: "Orders", icon: "fa-shopping-bag" },
  { to: "/admin/settings", label: "Settings", icon: "fa-cog" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-background border-r border-outline/40 min-h-screen flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-outline/40">
        <h1 className="text-2xl font-serif font-bold text-on-surface tracking-tight">
          Kioto
        </h1>
        <p className="text-xs text-on-surface-variant/70 font-medium tracking-widest uppercase mt-1">
          Admin Dashboard
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface hover:text-on-surface w-full transition-colors">
          <i className="fa fa-sign-out-alt w-5 text-center"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
