# UI Store Specification

## Overview
New UI store for managing modal state, loading indicators, and user preferences.

## State
```typescript
interface UIState {
  // Modal state
  modals: {
    cart: boolean;
    search: boolean;
    auth: boolean;
    productDetails: boolean;
    imageGallery: boolean;
  };
  modalData: {
    productDetails: Product | null;
    imageGallery: {
      images: string[];
      initialIndex: number;
    } | null;
  };

  // Loading states
  globalLoading: boolean;
  loadingMessages: Record<string, string>;

  // Filter/sort preferences (persisted)
  preferences: {
    productSortBy: 'name' | 'price' | 'createdAt';
    productSortOrder: 'asc' | 'desc';
    productsPerPage: 12 | 24 | 48;
    showOutOfStock: boolean;
  };

  // UI flags
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
}
```

## Actions
```typescript
interface UIActions {
  // Modal actions
  openModal: (modal: keyof UIState['modals'], data?: unknown) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  toggleModal: (modal: keyof UIState['modals'], data?: unknown) => void;

  // Loading actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setLoadingMessage: (key: string, message: string) => void;
  clearLoadingMessage: (key: string) => void;

  // Preference actions
  setPreference: <K extends keyof UIState['preferences']>(
    key: K,
    value: UIState['preferences'][K]
  ) => void;
  resetPreferences: () => void;

  // UI flag actions
  setMobileMenuOpen: (open: boolean) => void;
  setScrolled: (scrolled: boolean) => void;

  // Utility actions
  reset: () => void;
}
```

## Requirements

### REQ-001: Modal management
**GIVEN** a user interaction that should open a modal
**WHEN** `openModal(modal, data?)` is called
**THEN**
- Set `modals[modal]` to true
- If data is provided: update `modalData[modal]` with the data
- Example: `openModal('productDetails', product)` opens product modal with data

**GIVEN** a modal is open
**WHEN** `closeModal(modal)` is called
**THEN**
- Set `modals[modal]` to false
- Clear any `modalData` associated with that modal

**GIVEN** a modal toggle action
**WHEN** `toggleModal(modal, data?)` is called
**THEN**
- If modal is open: close it and clear data
- If modal is closed: open it with optional data

### REQ-002: Global loading state
**GIVEN** a long-running operation
**WHEN** `setGlobalLoading(true, message?)` is called
**THEN**
- Set `globalLoading` to true
- If message provided: set as default loading message
- Show global loading indicator (spinner/overlay) throughout app

**GIVEN** operation completes
**WHEN** `setGlobalLoading(false)` is called
**THEN**
- Set `globalLoading` to false
- Hide global loading indicator

### REQ-003: Loading message registry
**GIVEN** multiple async operations running
**WHEN** `setLoadingMessage(key, message)` is called
**THEN**
- Store message under the provided key
- Each operation can have independent loading status
- Used with async operation tracking

**GIVEN** an operation completes
**WHEN** `clearLoadingMessage(key)` is called
**THEN**
- Remove message for that key
- When all messages cleared, clear global loading

### REQ-004: Preferences persistence
**GIVEN** user changes a preference
**WHEN** `setPreference(key, value)` is called
**THEN**
- Update `preferences[key]` with new value
- If using persist middleware: auto-save to localStorage
- Changes persist across sessions

**GIVEN** user wants to reset preferences
**WHEN** `resetPreferences()` is called
**THEN**
- Reset all preferences to default values:
  - `productSortBy`: 'createdAt'
  - `productSortOrder`: 'desc'
  - `productsPerPage`: 12
  - `showOutOfStock`: false

### REQ-005: Mobile menu management
**GIVEN** mobile screen interactions
**WHEN** `setMobileMenuOpen(open)` is called
**THEN**
- Set `isMobileMenuOpen` to provided boolean
- Close menu automatically on route change or screen resize

### REQ-006: Scroll state tracking
**GIVEN** user scrolls the page
**WHEN** `setScrolled(scrolled)` is called
**THEN**
- Track if page is scrolled (for header styling)
- Used to show/hide header shadow, change background

### REQ-007: Reset state
**GIVEN** user logs out or wants fresh state
**WHEN** `reset()` is called
**THEN**
- Close all modals
- Clear modal data
- Reset global loading
- Keep preferences (persisted separately)
- Reset UI flags (mobileMenuOpen, scrolled)

## Selectors
```typescript
// Modal selectors
export const useIsModalOpen = (modal: keyof UIState['modals']) =>
  useUIStore((state) => state.modals[modal]);

export const useModalData = <T>(modal: keyof UIState['modalData']) =>
  useUIStore((state) => state.modalData[modal]) as T | null;

// Loading selectors
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useLoadingMessage = (key: string) =>
  useUIStore((state) => state.loadingMessages[key]);

// Preference selectors
export const usePreferences = () => useUIStore((state) => state.preferences);
export const usePreference = <K extends keyof UIState['preferences']>(key: K) =>
  useUIStore((state) => state.preferences[key]);

// UI flag selectors
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useIsScrolled = () => useUIStore((state) => state.isScrolled);
```

## Persistence
Preferences should be persisted using Zustand's persist middleware:
```typescript
export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({/* actions */}),
    {
      name: 'ui-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
```