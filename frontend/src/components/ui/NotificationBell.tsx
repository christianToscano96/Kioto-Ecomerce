import { useState, useEffect, useRef } from 'react';
import { useNotificationsStore } from '@/store/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Audio context for notification sound
let audioContext: AudioContext | null = null;
const playNotificationSound = () => {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Silent fail if audio not allowed
  }
};

const BellIcon = () => (
  <span className="material-symbols-outlined">notifications</span>
);

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationsStore();

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Fetch notifications when opening
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      setHasNewNotification(false);
    }
  }, [isOpen, fetchNotifications]);

  // Animate badge when there are unread notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      playNotificationSound();
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return 'shopping_bag';
      case 'low_stock': return 'inventory_2';
      case 'out_of_stock': return 'dangerous';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-primary';
      case 'low_stock': return 'text-terracota-600';
      case 'out_of_stock': return 'text-error';
      default: return 'text-on-surface-variant';
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `hace ${days}d`;
    if (hours > 0) return `hace ${hours}h`;
    if (minutes > 0) return `hace ${minutes}m`;
    return 'ahora';
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  const handleViewOrder = (orderId?: string) => {
    if (orderId) {
      // Use full orderId, not sliced version
      window.location.href = `/admin/orders/${orderId}`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-surface-container transition-colors"
        aria-label="Notificaciones"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-transform ${
            hasNewNotification ? 'animate-pulse' : ''
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-container-low rounded-xl shadow-lg border border-outline-variant/40 z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="font-serif font-bold text-on-surface">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 block">
                  notifications_none
                </span>
                No hay notificaciones
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-outline-variant/10 last:border-0 cursor-pointer transition-colors ${
                    notification.read ? 'opacity-60' : 'bg-primary-container/20'
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`material-symbols-outlined text-sm ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-on-surface text-sm">{notification.title}</p>
                        {notification.type === 'order' && notification.orderId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(notification.orderId);
                            }}
                            className="text-xs text-primary hover:underline ml-2"
                          >
                            Ver pedido
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">{notification.message}</p>
                      <p className="text-xs text-on-surface-variant/60 mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}