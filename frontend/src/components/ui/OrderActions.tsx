import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '@/store/orders';
import { toast } from 'sonner';
import type { Order } from '../../../../shared/src';

interface OrderActionsProps {
  orderId: string;
  status: Order['status'];
  onPrintLabel?: (orderId: string) => void;
}

export function OrderActions({ orderId, status, onPrintLabel }: OrderActionsProps) {
  const [open, setOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleView = () => {
    navigate(`/admin/orders/${orderId}`);
    setOpen(false);
  };

  const handleChangeStatus = async (newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    setOpen(false);
  };

  const handleResendEmail = async () => {
    try {
      setResending(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/orders/${orderId}/resend-email`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        toast.success('Email reenviado correctamente');
      } else {
        toast.error('Error al reenviar email');
      }
    } catch (error) {
      toast.error('Error al reenviar email');
    } finally {
      setResending(false);
      setOpen(false);
    }
  };

  const nextStatus = (): Order['status'] | null => {
    const flow: Order['status'][] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
    const idx = flow.indexOf(status);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-on-surface-variant hover:text-primary transition-colors p-1"
        aria-label={`Acciones para pedido ${orderId.slice(-8)}`}
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-outline-variant z-10 py-1">
          <button
            onClick={handleView}
            className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Ver Detalle
          </button>
          
          {onPrintLabel && (
            <button
              onClick={() => { onPrintLabel(orderId); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir Etiqueta
            </button>
          )}
          
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            {resending ? 'Enviando...' : 'Reenviar Email'}
          </button>
          
          {status !== 'delivered' && status !== 'cancelled' && nextStatus() && (
            <button
              onClick={() => handleChangeStatus(nextStatus()!)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              Marcar como {STATUS_LABELS[nextStatus()!]}
            </button>
          )}
          
          {status !== 'cancelled' && (
            <button
              onClick={() => handleChangeStatus('cancelled')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors text-terracota-600 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
              Cancelar Pedido
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Status labels for next status display
const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};