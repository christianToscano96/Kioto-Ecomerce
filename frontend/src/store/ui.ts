import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UiState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  notifications: Notification[];
}

interface UiActions {
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  // State
  isMobileMenuOpen: false,
  isSearchOpen: false,
  notifications: [],

  // Mobile menu
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Notifications
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// Selectors
export const useIsMobileMenuOpen = () => useUiStore((state) => state.isMobileMenuOpen);
export const useIsSearchOpen = () => useUiStore((state) => state.isSearchOpen);
export const useNotifications = () => useUiStore((state) => state.notifications);