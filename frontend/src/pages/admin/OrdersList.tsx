import { Badge } from '@/components/ui/Badge';
import { useAdminOrders } from '@/lib/api';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-verde-bosque-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export function OrdersList() {
  const { data: orders, isLoading, error } = useAdminOrders();

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
        Error loading orders. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-chocolate-900">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-chocolate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chocolate-100">
            {orders?.map((order) => (
              <tr key={order._id} className="hover:bg-chocolate-25">
                <td className="px-6 py-4 text-chocolate-900">
                  #{order._id.slice(-8)}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      order.status === 'paid'
                        ? 'default'
                        : order.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-chocolate-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-chocolate-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className="p-8 text-center text-chocolate-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}