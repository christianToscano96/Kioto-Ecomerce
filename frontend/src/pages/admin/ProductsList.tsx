import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { useProductsStore } from "@/store/products";
import { useEffect } from "react";

const LoaderIcon = () => (
  <svg
    className="animate-spin h-8 w-8 text-verde-bosque-600"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export function ProductsList() {
  const products = useProductsStore((state) => state.products);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const fetchAdminProducts = useProductsStore(
    (state) => state.fetchAdminProducts,
  );
  const deleteProduct = useProductsStore((state) => state.deleteProduct);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteProduct(id);
    }
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
        Error al cargar productos. Por favor, intenta de nuevo.
      </div>
    );
  }

  // Calculate metrics
  const totalItems = products?.length || 0;
  const lowStock = products?.filter((p) => p.stock <= 5).length || 0;
  const categories =
    new Set(products?.map((p) => p.slug?.split("-")[0])).size || 0;
  const activeSales = products?.filter((p) => p.published).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-on-surface">
          Productos
        </h1>
        <Link to="/admin/products/new">
          <Button>
            <PlusIcon />
            Nuevo Producto
          </Button>
        </Link>
      </div>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total de Artículos"
          value={totalItems}
          icon={
            <span className="material-symbols-outlined text-6xl text-primary/10">
              inventory_2
            </span>
          }
        />
        <MetricCard
          label="Stock Bajo"
          value={lowStock}
          icon={
            <span className="material-symbols-outlined text-6xl text-terracota-600/10">
              warning
            </span>
          }
        />
        <MetricCard
          label="Categorías"
          value={categories}
          icon={
            <span className="material-symbols-outlined text-6xl text-verde-bosque-600/10">
              category
            </span>
          }
        />
        <MetricCard
          label="Ventas Activas"
          value={activeSales}
          icon={
            <span className="material-symbols-outlined text-6xl text-primary/10">
              storefront
            </span>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {products?.map((product) => (
              <tr key={product._id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-surface-container rounded flex items-center justify-center">
                      <span className="text-xs text-on-surface-variant">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-on-surface">
                      {product.name}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      /{product.slug}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                    {product.stock} disponibles
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/products/${product._id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <EditIcon />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products?.length === 0 && (
          <div className="p-8 text-center text-on-surface-variant">
            No se encontraron productos. Crea tu primer producto para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}
