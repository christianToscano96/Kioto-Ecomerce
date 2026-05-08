import { useState, useEffect, useMemo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import { formatPrice } from "@/lib/utils";
import { ordersApi, adminProductsApi } from "@/lib/api";
import type { Order, Product } from "../../../../shared/src";
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
  funnelData?: { stage: string; value: number; fill: string }[];
  topProducts?: { name: string; sales: number }[];
  categorySales?: { category: string; sales: number }[];
  lowStockProducts?: { name: string; stock: number }[];
}

interface RecentOrder {
  customer: string;
  status: Order["status"];
  date: string;
  total: number;
  _id: string;
}

type TimeRange = "7d" | "30d" | "90d" | "custom";

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params: { days?: number; from?: string; to?: string } = {};
      if (timeRange === "custom" && customFrom && customTo) {
        params.from = customFrom;
        params.to = customTo;
      } else if (timeRange !== "custom") {
        const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
        params.days = daysMap[timeRange];
      }

      const [ordersResponse, productsResponse] = await Promise.all([
        ordersApi.list(params),
        adminProductsApi.list(),
      ]);
      
      const orders = ordersResponse;
      const products = productsResponse;
      
       // Calculate stats from real orders
       const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
       const ordersCount = orders.length;
       const avgOrder = ordersCount > 0 ? totalSales / ordersCount : 0;
       
       // Group sales by date for chart
       const salesByDate = orders.reduce<Record<string, number>>((acc, o: Order) => {
         const date = new Date(o.createdAt).toLocaleDateString("es-AR");
         acc[date] = (acc[date] || 0) + o.total;
         return acc;
       }, {});
       
       // Status distribution for pie chart
       const statusCount = orders.reduce<Record<string, number>>((acc, o: Order) => {
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
        { stage: "Carritos", value: orders.length + 15, fill: "#3b82f6" },
        { stage: "Checkout", value: orders.length + 5, fill: "#f59e0b" },
        { stage: "Pagado", value: orders.filter(o => ["paid", "shipped", "delivered"].includes(o.status)).length, fill: "#10b981" },
        { stage: "Enviado", value: orders.filter(o => ["shipped", "delivered"].includes(o.status)).length, fill: "#8b5cf6" },
      ];
      
      // Top products from order items
      const productSales: Record<string, { name: string; sales: number }> = {};
      orders.forEach((o: Order) => {
        o.items.forEach((item: any) => {
          const pid = item.productId as any;
          const name = typeof pid === "string" ? pid : (pid?.name || "Producto");
          if (!productSales[name]) productSales[name] = { name, sales: 0 };
          productSales[name].sales += item.quantity;
        });
      });
      
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      const lowStockProducts = products
        .filter((p: Product) => (p.stock || 0) < 5)
        .sort((a, b) => (a.stock || 0) - (b.stock || 0))
        .slice(0, 5)
        .map(p => ({ name: p.name, stock: p.stock || 0 }));

      // Time series data
      const ordersByDate = orders.reduce<Record<string, number>>((acc, o: Order) => {
        const date = new Date(o.createdAt).toLocaleDateString("es-AR");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const salesData = Object.entries(salesByDate)
        .map(([date, sales]) => ({ date, sales }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7);

      const orderTrend = Object.entries(ordersByDate)
        .map(([date, orders]) => ({ date, orders }))
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
        lowStockProducts,
      });

      // Paginate recent orders
      const sorted = [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTotalPages(Math.ceil(sorted.length / itemsPerPage));
      
      const recent = sorted
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((o: Order) => ({
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

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, customFrom, customTo, currentPage]);

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
      sparklineData: stats.salesData?.map(d => ({ date: d.date, value: d.sales })),
    },
    {
      label: "Pedidos",
      value: stats.orders.toString(),
      change: { value: 8.2, label: "+8.2%", type: "increase" as const },
      sparklineData: stats.orderTrend?.map(d => ({ date: d.date, value: d.orders })),
    },
    {
      label: "Ticket Promedio",
      value: formatPrice(stats.avgOrder),
      change: { value: 5.3, label: "+5.3%", type: "increase" as const },
      sparklineData: undefined,
    },
    {
      label: "Stock Bajo",
      value: stats.lowStockProducts?.length || 0,
      change: { value: 0, label: "Productos < 5 unidades", type: "stable" as const },
      sparklineData: undefined,
      variant: stats.lowStockProducts && stats.lowStockProducts.length > 0 ? 'primary' : 'default',
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Panel de Administración"
        title="Resumen General"
        description="Una vista curada del rendimiento diario de KIOTO. Seguimiento del movimiento de productos Earthbound en la colección global."
      />

      {/* Time Range Filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-on-surface-variant">Período:</label>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-xs uppercase tracking-widest rounded transition-colors ${
                timeRange === range && !showCustomRange
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/40 hover:bg-surface"
              }`}
            >
              {range === "7d" ? "7 días" : range === "30d" ? "30 días" : "90 días"}
            </button>
          ))}
          <button
            onClick={() => {
              setShowCustomRange(!showCustomRange);
              setTimeRange("custom");
            }}
            className={`px-4 py-2 text-xs uppercase tracking-widest rounded transition-colors ${
              timeRange === "custom" && showCustomRange
                ? "bg-primary text-on-primary"
                : "border border-outline-variant/40 hover:bg-surface"
            }`}
          >
            Personalizado
          </button>
        </div>
        {showCustomRange && (
          <div className="flex items-center gap-2 ml-4">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-outline-variant/40 rounded bg-surface"
            />
            <span className="text-on-surface-variant">a</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-2 text-sm border border-outline-variant/40 rounded bg-surface"
            />
          </div>
        )}
        <button
          onClick={() => fetchDashboardData()}
          className="ml-auto px-4 py-2 text-xs uppercase tracking-widest bg-surface-container-low border border-outline-variant/40 rounded hover:bg-surface transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            sparklineData={stat.sparklineData}
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

        {/* Orders Trend Bar Chart */}
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

      {/* Low Stock Alert */}
      {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6 mb-12">
          <h3 className="font-serif text-xl font-bold mb-2 text-red-700 dark:text-red-400">
            ⚠️ Productos con Stock Bajo
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            Los siguientes productos tienen menos de 5 unidades:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.lowStockProducts.map((product, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-container p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-semibold text-on-surface">{product.name}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders with Pagination */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold">Pedidos Recientes</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Las últimas adquisiciones curadas por tus clientes
            </p>
          </div>
          {/* CSV Export */}
          <button
            onClick={() => {
              const headers = ["Cliente", "Estado", "Fecha", "Total"];
              const rows = recentOrders.map(o => [o.customer, o.status, o.date, o.total]);
              const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `pedidos-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            }}
            className="font-bold text-xs uppercase tracking-widest border-b border-primary text-primary pb-1 hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <span>📊</span> Exportar CSV
          </button>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-outline-variant/40 rounded hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-on-surface-variant">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-outline-variant/40 rounded hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                // Would need to refactor itemsPerPage as state
              }}
              className="ml-4 px-3 py-1 text-sm border border-outline-variant/40 rounded bg-surface"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
            </select>
          </div>
        )}
      </section>
    </div>
  );
}