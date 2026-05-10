import { NotificationBell } from "@/components/ui/NotificationBell";
import { initNotifications, useNotificationsSocket } from "@/store/notifications";
import { useEffect } from "react";

// Init notifications on module load
initNotifications();

interface UtilityTopBarProps {
  className?: string;
}

export function UtilityTopBar({ className }: UtilityTopBarProps) {
  // Initialize Socket.IO connection for real-time notifications
  useNotificationsSocket();

  return (
    <header className={`fixed top-0 right-0 left-64 h-16 bg-surface-container-low border-b border-outline-variant/30 z-40 ${className || ''}`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search orders, products..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* Chat */}
          <button className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">chat</span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-on-primary-container">person</span>
            </div>
            <span className="text-sm font-medium text-on-surface">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}