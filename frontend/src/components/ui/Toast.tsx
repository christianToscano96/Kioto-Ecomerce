import { useEffect } from 'react';
import { create } from 'zustand';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [{ ...toast, id }, ...state.toasts] }));
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
} as const;

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-terracota-600',
  info: 'text-blue-600',
} as const;

function ToastItem({ toast }: { toast: ToastData }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div className="bg-surface-container-low rounded-lg shadow-lg border border-outline-variant/40 p-4 mb-2 flex items-start gap-3 min-w-[320px] animate-in slide-in-from-top">
      <Icon className={`h-5 w-5 mt-0.5 ${colors[toast.type]}`} />
      <div className="flex-1">
        <p className="font-medium text-on-surface text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-on-surface-variant mt-1">{toast.message}</p>
        )}
      </div>
      <button onClick={() => removeToast(toast.id)} className="text-on-surface-variant hover:text-on-surface">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}

// Public API
export const showToast = (data: Omit<ToastData, 'id'>) => {
  useToastStore.getState().addToast(data);
};

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  return { addToast };
}