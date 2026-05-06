import { ReactNode } from 'react';

interface Column<T> {
  key?: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => ReactNode;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-terracota-100 text-terracota-800',
  processing: 'bg-primary-container text-on-primary-container',
  shipped: 'bg-secondary-container text-on-secondary-container',
  delivered: 'bg-verde-bosque-600 text-white',
  cancelled: 'bg-terracota-600 text-white',
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dashed border-outline-variant/40">
{columns.map((column, colIndex) => (
              <th
                key={column.key ? String(column.key) : `col-${colIndex}`}
                className="py-4 text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant"
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="py-4 text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-sm font-body">
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-dashed border-outline-variant/20 hover:bg-surface-container-low transition-colors"
            >
{columns.map((column, colIndex) => (
                <td key={column.key ? String(column.key) : `cell-${index}-${colIndex}`} className="py-6">
                  {column.render
                    ? column.render(column.key ? row[column.key] : undefined, row)
                    : column.key ? String(row[column.key] ?? '') : null}
                </td>
              ))}
              {actions && <td className="py-6">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}