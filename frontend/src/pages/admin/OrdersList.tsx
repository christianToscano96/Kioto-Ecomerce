import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { OrderActions } from '@/components/ui/OrderActions';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';
import { useOrdersStore } from '@/store/orders';
import type { Order } from '../../../../shared/src';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// Status configuration with Earthbound Curator colors
const ORDER_STATUS: Order['status'][] = ['pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

// Items per page for pagination
const ITEMS_PER_PAGE = 10;

// Helper function to determine badge variant based on status
function getStatusBadgeVariant(status: Order['status']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    case 'processing':
      return 'default';
    case 'shipped':
      return 'secondary';
    case 'delivered':
      return 'outline';
    case 'failed':
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function OrdersList() {
  const orders = useOrdersStore((state) => state.orders);
  const isLoading = useOrdersStore((state) => state.isLoading);
  const error = useOrdersStore((state) => state.error);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: Order['status'] | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg">
        Error al cargar pedidos. Por favor, intenta de nuevo.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos"
        description="Gestionar y seguir los pedidos de clientes"
        eyebrow="Panel de Administración"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Procesando"
          value={orders?.filter(o => o.status === 'pending').length || 0}
          icon={<span className="material-symbols-outlined text-6xl text-primary/10">pending_actions</span>}
        />
        <MetricCard
          label="En Espera de Envío"
          value={orders?.filter(o => o.status === 'paid').length || 0}
          icon={<span className="material-symbols-outlined text-6xl text-verde-bosque-600/10">local_shipping</span>}
        />
        <MetricCard
          label="Ingresos Totales"
          value={`$${orders?.reduce((sum, o) => sum + o.total, 0).toFixed(2) || '0.00'}`}
          icon={<span className="material-symbols-outlined text-6xl text-primary/10">attach_money</span>}
        />
        <MetricCard
          label="Devoluciones"
          value={orders?.filter(o => o.status === 'cancelled').length || 0}
          icon={<span className="material-symbols-outlined text-6xl text-terracota-600/10">assignment_return</span>}
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 stitch-border-b pb-4">
        <div className="flex-1 flex items-center gap-4">
          <Input
            type="text"
            placeholder="Buscar por ID de Pedido..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as Order['status'] | 'all')}
            className="h-10 rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los Estados</option>
            {ORDER_STATUS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <Button className="whitespace-nowrap">
          <span className="material-symbols-outlined mr-2">add</span>
          Crear Pedido Manual
        </Button>
      </div>

{/* Orders Table */}
       <div className="bg-surface-container-low rounded-lg border border-outline-variant/30 overflow-hidden">
         <DataTable
           columns={[
             {
               key: '_id',
               label: 'ID de Pedido',
               render: (_, row) => (
                 <span className="font-mono text-on-surface">
                   #{row._id.slice(-8)}
                 </span>
               ),
             },
             {
               key: 'customer',
               label: 'Cliente',
               render: (_, row) => (
                 <div className="text-sm">
                   <p className="font-medium text-on-surface">
                     {row.shippingDetails?.name || 'Cliente anónimo'}
                   </p>
                   <p className="text-on-surface-variant text-xs">
                     {row.shippingDetails?.email || '-'}
                   </p>
                 </div>
               ),
             },
             {
               key: 'items',
               label: 'Productos',
               render: (_, row) => {
                 const itemCount = row.items?.length || 0;
                 const totalQty = row.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                 return (
                   <span className="text-sm text-on-surface">
                     {itemCount} {itemCount === 1 ? 'producto' : 'productos'} ({totalQty} unidades)
                   </span>
                 );
               },
             },
             {
               key: 'createdAt',
               label: 'Fecha',
               render: (value) => {
                 const date = new Date(value as string);
                 return (
                   <span className="text-on-surface">
                     {date.toLocaleDateString('es-ES', {
                       month: 'short',
                       day: 'numeric',
                       year: 'numeric',
                     })}
                   </span>
                 );
               },
             },
             {
               key: 'total',
               label: 'Total',
               render: (value) => (
                 <span className="font-semibold text-on-surface">
                   ${(value as number).toFixed(2)}
                 </span>
               ),
             },
             {
               key: 'status',
               label: 'Estado',
               render: (value) => {
                 const status = value as Order['status'];
                 return (
                   <Badge
                     variant={getStatusBadgeVariant(status)}
                     size="md"
                   >
                     {STATUS_LABELS[status]}
                   </Badge>
                 );
               },
             },
           ]}
           data={paginatedOrders}
           actions={(row) => (
             <OrderActions orderId={row._id} status={row.status} />
           )}
         />
       </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} al{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} de{' '}
            {filteredOrders.length} pedidos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-lg border border-outline hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg border ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'border-outline hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-lg border border-outline hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders?.length === 0 && (
        <div className="p-8 text-center text-on-surface-variant">
          No se encontraron pedidos.
        </div>
      )}
    </div>
  );
}