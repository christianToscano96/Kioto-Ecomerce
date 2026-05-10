import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-terracota-600',
  info: 'text-blue-600',
};

function ToastItem({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  return (
    <div className="bg-surface-container-low rounded-lg shadow-lg border border-outline-variant/40 p-4 mb-2 flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right">
      <Icon className={`h-5 w-5 mt-0.5 ${colors[toast.type]}`} />
      <div className="flex-1">
        <p className="font-medium text-on-surface text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-on-surface-variant mt-1">{toast.message}</p>
        )}
      </div>
      <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast container
let toastContainer: HTMLDivElement | null = null;
let toasts: ToastData[] = [];
let forceUpdate: () => void = () => {};

function ToastContainer() {
  const [, setVersion] = useState(0);
  forceUpdate = () => setVersion(v => v + 1);

  const removeToast = (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    forceUpdate();
  };

  // Ensure container exists
  useEffect(() => {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-[9999]';
      document.body.appendChild(toastContainer);
    }
  }, []);

  if (!toastContainer) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// Initialize container
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[9999]';
      document.body.appendChild(container);
    }
  });
}

// Public API
let idCounter = 0;

export function showToast(data: Omit<ToastData, 'id'>) {
  const id = `toast-${++idCounter}`;
  toasts = [{ ...data, id }, ...toasts];
  forceUpdate();
}

export function dismissToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  forceUpdate();
}

// useToast hook for compatibility
export function useToast() {
  const addToast = (data: Omit<ToastData, 'id'>) => showToast(data);
  return { addToast };
}

// Export ToastContainer for global rendering
export { ToastContainer };