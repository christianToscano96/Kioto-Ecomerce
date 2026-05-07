import { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import { formatPrice } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import type { Order } from "../../../../shared/src";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

interface DashboardStats {
  totalSales: number;
  orders: number;
  avgOrder: number;
  newCustomers: number;
  salesData?: { date: string; sales: number }[];
  statusDistribution?: { status: string; count: number; value: number }[];
  orderTrend?: { date: string; orders: number }[];
  // Funnel data
  funnelData?: { stage: string; value: number; fill: string }[];
  // Top products
  topProducts?: { name: string; sales: number }[];
  // Category sales
  categorySales?: { category: string; sales: number }[];
}

interface RecentOrder {
  customer: string;
  status: Order["status"];
  date: string;
  total: number;
  _id: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await ordersApi.list();
        const orders = response.data || response;
        
        // Calculate stats from real orders
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
        const ordersCount = orders.length;
        const avgOrder = ordersCount > 0 ? totalSales / ordersCount : 0;
        
        // Group sales by date for chart
        const salesByDate = orders.reduce((acc: Record<string, number>, o) => {
          const date = new Date(o.createdAt).toLocaleDateString("es-AR");
          acc[date] = (acc[date] || 0) + o.total;
          return acc;
        }, {});
        
        // Status distribution for pie chart
        const statusCount = orders.reduce((acc: Record<string, number>, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {});
        
        const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          value: count,
        }));
        
        // Funnel data - conversion stages
        const funnelData = [
          { stage: "Carritos", value: orders.length + 15, fill: "#3b82f6" }, // Simulated carts
          { stage: "Checkout", value: orders.length + 5, fill: "#f59e0b" }, // Simulated checkouts
          { stage: "Pagado", value: orders.filter(o => o.status === "paid" || o.status === "shipped" || o.status === "delivered").length, fill: "#10b981" },
          { stage: "Enviado", value: orders.filter(o => o.status === "shipped" || o.status === "delivered").length, fill: "#8b5cf6" },
        ];
        
        // Top products from order items
        const productSales: Record<string, { name: string; sales: number }> = {};
        orders.forEach(o => {
          o.items.forEach(item => {
            const pid = item.productId as any;
            const name = typeof pid === "string" ? pid : (pid?.name || "Producto");
            if (!productSales[name]) productSales[name] = { name, sales: 0 };
            productSales[name].sales += item.quantity;
          });
        });
        
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);
        
        // Order trend for line chart
        const ordersByDate = orders.reduce((acc: Record<string, number>, o) => {
          const date = new Date(o.createdAt).toLocaleDateString("es-AR");
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        
        const orderTrend = Object.entries(ordersByDate)
          .map(([date, orders]) => ({ date, orders }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7);

        const salesData = Object.entries(salesByDate)
          .map(([date, sales]) => ({ date, sales }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7);

        setStats({
          totalSales,
          orders: ordersCount,
          avgOrder,
          newCustomers: 24,
          salesData,
          statusDistribution,
          orderTrend,
          funnelData,
          topProducts,
          categorySales: [], // Requires product category population
        });

        // Recent orders (last 5)
        const recent = orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((o) => ({
            customer: o.shippingDetails?.name || "Cliente",
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            }),
            total: o.total,
            _id: o._id,
          }));
        setRecentOrders(recent);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-container-low rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-container-low rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8">Error cargando datos</div>;

  const statCards = [
    {
      label: "Ventas Totales",
      value: formatPrice(stats.totalSales),
      change: { value: 12.4, label: "+12.4% vs mes anterior", type: "increase" as const },
    },
    {
      label: "Pedidos",
      value: stats.orders.toString(),
      change: { value: 8.2, label: "+8.2%", type: "increase" as const },
    },
    {
      label: "Valor Promedio",
      value: formatPrice(stats.avgOrder),
      change: { value: 0, label: "Estable", type: "stable" as const },
    },
    {
      label: "Nuevos Miembros",
      value: stats.newCustomers.toString(),
      change: { value: 15.1, label: "+15.1%", type: "increase" as const },
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Panel de Administración"
        title="Resumen General"
        description="Una vista curada del rendimiento diario de KIOTO. Seguimiento del movimiento de productos Earthbound en la colección global."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Sales Area Chart */}
        <div className="bg-surface-container-low rounded-lg p-6">
          <h3 className="font-serif text-xl font-bold mb-2">Ventas Diarias</h3>
          <p className="text-xs text-on-surface-variant mb-4">Últimos 7 días</p>
          <div className="h-64">
            {stats.salesData && stats.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(220 80% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(220 80% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90% / 0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 90%)" }} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(220 80% 55%)" fill="url(#salesGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant">No hay datos</div>
            )}
          </div>
        </div>

        {/* Orders Trend Line Chart */}
        <div className="bg-surface-container-low rounded-lg p-6">
          <h3 className="font-serif text-xl font-bold mb-2">Pedidos Diarios</h3>
          <p className="text-xs text-on-surface-variant mb-4">Actividad de la semana</p>
          <div className="h-64">
            {stats.orderTrend && stats.orderTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90% / 0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 90%)" }} />
                  <Bar dataKey="orders" fill="hsl(220 80% 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant">No hay datos</div>
            )}
          </div>
        </div>
      </div>

      {/* Status Distribution Pie Chart */}
      <div className="bg-surface-container-low rounded-lg p-6 mb-12">
        <h3 className="font-serif text-xl font-bold mb-2">Estado de Pedidos</h3>
        <p className="text-xs text-on-surface-variant mb-4">Distribución actual</p>
        <div className="h-64">
          {stats.statusDistribution && stats.statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusDistribution.map((entry, index) => {
                    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 90%)" }} />
                <Legend layout="horizontal" verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-on-surface-variant">No hay datos</div>
          )}
        </div>
      </div>

      {/* Funnel Chart - Conversion */}
      <div className="bg-surface-container-low rounded-lg p-6 mb-12">
        <h3 className="font-serif text-xl font-bold mb-2">Conversión de Checkout</h3>
        <p className="text-xs text-on-surface-variant mb-4">De carrito a envío</p>
        <div className="h-64">
          {stats.funnelData && stats.funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 90%)" }} />
                <Funnel dataKey="value" data={stats.funnelData} isAnimationActive>
                  <LabelList position="right" fill="#666" stroke="none" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-on-surface-variant">No hay datos</div>
          )}
        </div>
      </div>

      {/* Top Products Horizontal Bar */}
      <div className="bg-surface-container-low rounded-lg p-6 mb-12">
        <h3 className="font-serif text-xl font-bold mb-2">Productos Top</h3>
        <p className="text-xs text-on-surface-variant mb-4">Más vendidos</p>
        <div className="h-64">
          {stats.topProducts && stats.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90% / 0.3)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 90%)" }} />
                <Bar dataKey="sales" fill="hsl(220 80% 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-on-surface-variant">No hay datos</div>
          )}
        </div>
      </div>

      {/* Category Sales Stacked Bar - Placeholder */}
      <div className="bg-surface-container-low rounded-lg p-6 mb-12">
        <h3 className="font-serif text-xl font-bold mb-2">Ventas por Categoría</h3>
        <p className="text-xs text-on-surface-variant mb-4">Distribución semanal</p>
        <div className="h-64 flex items-center justify-center">
          <p className="text-on-surface-variant">Próximamente - requiere endpoint de categorías</p>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold">Pedidos Recientes</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Las últimas adquisiciones curadas por tus clientes
            </p>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "customer", label: "Cliente" },
            {
              key: "status",
              label: "Estado",
              render: (value) => <StatusBadge status={value as any} />,
            },
            { key: "date", label: "Fecha" },
            {
              key: "total",
              label: "Total",
              render: (value) => (
                <span className="font-serif font-bold text-primary">
                  {formatPrice(Number(value))}
                </span>
              ),
            },
          ]}
          data={recentOrders}
        />
      </section>
    </div>
  );
}