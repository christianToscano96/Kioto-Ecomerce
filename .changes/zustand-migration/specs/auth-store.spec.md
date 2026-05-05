# Auth Store Specification

## Overview
Extended auth store with token refresh capability and automatic session management.

## Existing State (from auth.ts)
```typescript
interface AuthState {
  user: User | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}
```

## New State
```typescript
interface AuthState {
  user: User | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // computed
}
```

## New Actions
```typescript
interface AuthActions {
  // Existing actions
  login: (user: User, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // NEW async actions
  refreshAuthToken: () => Promise<boolean>;
  refreshTokenIfNeeded: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
}
```

## Requirements

### REQ-001: refreshAuthToken - Refresh expired access token
**GIVEN** a user with a valid refresh token stored
**WHEN** `refreshAuthToken()` is called
**THEN**
- Make POST request to `/api/auth/refresh` with current refreshToken
- On success: store new token, keep user data, return true
- On failure (401/403): clear all auth state (logout), return false
- Set `isLoading` appropriately during request

### REQ-002: refreshTokenIfNeeded - Conditional token refresh
**GIVEN** an application making API calls
**WHEN** `refreshTokenIfNeeded()` is called
**THEN**
- Check if access token is about to expire (within 5 minutes)
- If expiring soon: call `refreshAuthToken()`
- If still valid: return true without API call
- Return boolean indicating if session is valid

### REQ-003: checkAuthStatus - Validate existing session
**GIVEN** a user returning to the app (possibly session restored from persist)
**WHEN** `checkAuthStatus()` is called
**THEN**
- Make GET request to `/api/auth/me`
- On success: update user data in store, return user
- On failure (401): clear auth state, redirect to login
- On other errors: set error state appropriately
- Set `isLoading` appropriately

### REQ-004: Automatic token refresh on 401
**GIVEN** an API call receives 401 Unauthorized
**WHEN** the axios interceptor catches the error
**THEN**
- Call `refreshAuthToken()` to get new token
- Retry original request with new token
- If refresh fails: logout user and redirect to login
- If refresh succeeds: complete original request

### REQ-005: Persist middleware
**GIVEN** user closes and reopens the app
**WHEN** the store reinitializes
**THEN**
- `user` and `refreshToken` are restored from localStorage
- `isLoading` and `error` are reset to defaults
- After rehydration, `checkAuthStatus()` is called automatically

### REQ-006: Logout clears persisted state
**GIVEN** a logged-in user
**WHEN** `logout()` is called
**THEN**
- Clear `user` and `refreshToken` from state
- Clear persisted storage (localStorage)
- Make POST request to `/api/auth/logout` for server cleanup
- Reset loading and error states

### REQ-007: Login flow
**GIVEN** a user submitting credentials
**WHEN** login form is submitted
**THEN**
- Set `isLoading` to true
- Call API endpoint `/api/auth/login`
- On success: call `login(user, refreshToken)` store action, show success toast
- On failure: set error with message, show error toast
- Set `isLoading` to false

## Selectors
```typescript
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useUserId = () => useAuthStore((state) => state.user?._id);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
```

## Integration Notes

### Axios Interceptor Pattern
```typescript
// In api.ts - response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshed = await useAuthStore.getState().refreshAuthToken();
      if (refreshed) {
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);
```