import { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import { formatPrice } from "@/lib/utils";
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
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Package,  AlertCircle,  } from '@/components/icons';

type TimeRange = "7d" | "30d" | "90d" | "custom";

export function DashboardOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { stats, recentOrders, loading, totalPages, refetch } = useDashboardStats({
    timeRange,
    customFrom,
    customTo,
    currentPage,
  });

  // Keep custom range in sync with timeRange
  useEffect(() => {
    if (timeRange !== "custom" && showCustomRange) {
      setShowCustomRange(false);
    }
  }, [timeRange, showCustomRange]);

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
           onClick={refetch}
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
        <div className="bg-surface-container-low rounded-lg p-6 mb-12 border-l-4 border-warning">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="text-warning" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-on-surface">
                  ⚠️ Productos con Stock Bajo
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {stats.lowStockProducts.length} productos necesitan reposición inmediata
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/admin/products'}
              className="font-bold text-xs uppercase tracking-widest px-4 py-2 bg-surface-container border border-outline-variant/40 rounded hover:bg-surface transition-colors"
            >
              Ver Productos
            </button>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((product, idx) => {
                  const stockPercent = Math.max(0, Math.min(100, (product.stock / 5) * 100));
                  const urgencyLevel = product.stock <= 0 ? 'critical' : product.stock <= 2 ? 'high' : 'medium';
                  
                  return (
                    <tr 
                      key={idx} 
                      className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center">
                            <Package className="text-on-surface-variant" />
                          </div>
                          <div>
                            <p className="font-medium text-on-surface">{product.name}</p>
                            <p className="text-xs text-on-surface-variant">ID: {idx + 1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-12 h-8 rounded-full text-sm font-bold ${
                          product.stock === 0 ? 'bg-error-container text-error' :
                          product.stock <= 2 ? 'bg-warning-container text-warning' :
                          'bg-surface-container text-on-surface'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden max-w-[120px]">
                            <div 
                              className={`h-full transition-all ${
                                urgencyLevel === 'critical' ? 'bg-error' :
                                urgencyLevel === 'high' ? 'bg-warning' : 'bg-secondary'
                              }`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-on-surface-variant w-16">
                            {stockPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              // Navigate to product edit
                              window.location.href = `/admin/products`;
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded hover:bg-primary/5 transition-colors"
                          >
                            Editar Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {stats.lowStockProducts.map((product, idx) => {
              const stockPercent = Math.max(0, Math.min(100, (product.stock / 5) * 100));
              
              return (
                <div 
                  key={idx} 
                  className="bg-surface-container rounded-lg p-4 border border-outline-variant/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-outline-variant/30 flex items-center justify-center">
                        <Package size={18} className="text-on-surface-variant" />
                      </div>
                      <div>
                        <p className="font-medium text-on-surface text-sm">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">Stock: {product.stock} unidades</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock === 0 ? 'bg-error-container text-error' :
                      'bg-warning-container text-warning'
                    }`}>
                      {product.stock === 0 ? 'Sin Stock' : 'Bajo'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                      <span>Nivel de inventario</span>
                      <span>{stockPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stock === 0 ? 'bg-error' : 'bg-warning'}`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = '/admin/products'}
                    className="w-full py-2 text-xs font-medium text-primary border border-primary/30 rounded hover:bg-primary/5 transition-colors"
                  >
                    Ir a Productos
                  </button>
                </div>
              );
            })}
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
            <span className="ml-4 text-xs text-on-surface-variant">5 por página</span>
          </div>
        )}
      </section>
    </div>
  );
}