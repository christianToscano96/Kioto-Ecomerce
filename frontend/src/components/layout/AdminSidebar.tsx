import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-chocolate-900 text-crema-50 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-serif font-bold text-crema-100">
          Earthbound Curator
        </h1>
        <p className="text-xs text-crema-400">Admin Dashboard</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-verde-bosque-600 text-white'
                  : 'text-crema-300 hover:bg-chocolate-800 hover:text-crema-100'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}