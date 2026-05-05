import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import { formatPrice } from "@/lib/utils";

// Datos mock - reemplazar con llamadas API reales
const stats = [
  {
    label: "Ventas Totales",
    value: formatPrice(42920),
    change: {
      value: 12.4,
      label: "+12.4% vs mes anterior",
      type: "increase" as const,
    },
  },
  {
    label: "Pedidos",
    value: "1,248",
    change: { value: 8.2, label: "+8.2%", type: "increase" as const },
  },
  {
    label: "Valor Promedio",
    value: "$184.20",
    change: { value: 0, label: "Estable", type: "stable" as const },
  },
  {
    label: "Nuevos Miembros",
    value: "342",
    change: { value: 15.1, label: "+15.1%", type: "increase" as const },
  },
];

const recentOrders = [
  {
    customer: "Julianne Laurent",
    status: "shipped" as const,
    date: "12 Oct, 2023",
    total: 492.0,
  },
  {
    customer: "Anders Muller",
    status: "processing" as const,
    date: "11 Oct, 2023",
    total: 1205.5,
  },
  {
    customer: "Sora Chen",
    status: "shipped" as const,
    date: "11 Oct, 2023",
    total: 320.0,
  },
  {
    customer: "Rafael Benitez",
    status: "pending" as const,
    date: "10 Oct, 2023",
    total: 89.0,
  },
  {
    customer: "Emma Davies",
    status: "shipped" as const,
    date: "10 Oct, 2023",
    total: 215.0,
  },
];

export function DashboardOverview() {
  return (
    <div>
      <PageHeader
        eyebrow="Panel de Administración"
        title="Resumen General"
        description="Una vista curada del rendimiento diario de KIOTO. Seguimiento del movimiento de productos Earthbound en la colección global."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-surface-container-low rounded-lg p-10 mb-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="font-serif text-2xl font-bold">Ventas en el Tiempo</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Crecimiento de la colección curada
            </p>
          </div>
          <div className="flex gap-2">
            <button className="text-[10px] uppercase tracking-widest px-4 py-2 border border-outline-variant/40 rounded hover:bg-surface transition-colors">
              Diario
            </button>
            <button className="text-[10px] uppercase tracking-widest px-4 py-2 bg-primary text-on-primary rounded">
              Semanal
            </button>
          </div>
        </div>

        {/* Mock Chart */}
        <div className="relative h-64 w-full flex items-end gap-2 border-b border-dashed border-outline-variant/40 pb-2">
          {[30, 45, 40, 65, 85, 55, 70].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all cursor-pointer"
              style={{ height: `${height}%` }}
            />
          ))}
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
          <button className="font-bold text-xs uppercase tracking-widest border-b border-primary text-primary pb-1 hover:opacity-70 transition-opacity">
            Ver Todos los Archivos
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
      </section>
    </div>
  );
}