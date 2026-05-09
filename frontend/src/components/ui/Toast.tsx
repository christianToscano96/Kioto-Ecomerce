import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id, duration: toast.duration ?? 4000 };
    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

const iconSymbols = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
};

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} index={index} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  index: number;
}

function ToastItem({ toast, index }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {}, 300);
  };

  return (
    <div
      className={clsx(
        'relative transform transition-all duration-500 ease-out pointer-events-auto w-full',
        isVisible && !isExiting 
          ? 'translate-y-0 opacity-100 scale-100' 
          : '-translate-y-8 opacity-0 scale-95'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md max-w-sm mx-auto',
          bgColors[toast.type]
        )}
      >
        <span className={clsx('material-symbols-outlined text-lg flex-shrink-0', colors[toast.type])}>
          {iconSymbols[toast.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className={clsx('text-on-surface text-sm font-medium', toast.title ? 'line-clamp-1' : 'line-clamp-2')}>
            {toast.title || toast.message}
          </p>
          {toast.title && (
            <p className="text-on-surface-variant text-xs mt-0.5 line-clamp-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}