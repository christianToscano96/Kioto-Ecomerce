import { create } from 'zustand';
import type { Notification } from '../../../shared/src';
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { showToast } from '@/components/ui/Toast';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/notifications?limit=20');
      const data = await res.json();
      set({ 
        notifications: data.notifications,
        unreadCount: data.unreadCount 
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await fetch('/api/notifications/unread-count');
      const data = await res.json();
      set({ unreadCount: data.count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      set(state => ({
        notifications: state.notifications.map(n => 
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },
}));

// Socket.IO hook for real-time notifications
export function useNotificationsSocket() {
  const addNotification = useNotificationsStore(state => state.addNotification);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    // Join admin room
    socket.emit('join-admin');

    // Listen for notifications
    socket.on('notification', (notification: Notification) => {
      addNotification(notification);
      
      // Show toast notification
      showToast({
        type: notification.type === 'order' ? 'info' : 
              notification.type === 'low_stock' ? 'warning' : 'error',
        title: notification.title,
        message: notification.message,
        duration: 8000,
      });
    });

    // Cleanup
    return () => {
      socket.emit('leave-admin');
      socket.disconnect();
    };
  }, [addNotification]);

  return socketRef.current;
}

// Auto-fetch on mount
let hasFetched = false;
export const initNotifications = () => {
  if (!hasFetched) {
    hasFetched = true;
    useNotificationsStore.getState().fetchUnreadCount();
  }
};