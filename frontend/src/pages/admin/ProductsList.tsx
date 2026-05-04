import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAdminProducts, useDeleteProduct } from "@/lib/api";

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
  const { data: products, isLoading, error } = useAdminProducts();
  const deleteMutation = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteMutation.mutateAsync(id);
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
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-chocolate-900">
          Products
        </h1>
        <Link to="/admin/products/new">
          <Button>
            <PlusIcon />
            New Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-chocolate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chocolate-100">
            {products?.map((product) => (
              <tr key={product._id} className="hover:bg-chocolate-25">
                <td className="px-6 py-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-chocolate-100 rounded flex items-center justify-center">
                      <span className="text-xs text-chocolate-400">
                        No image
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-chocolate-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-chocolate-500">
                      /{product.slug}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-chocolate-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                    {product.stock} in stock
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
          <div className="p-8 text-center text-chocolate-500">
            No products found. Create your first product to get started.
          </div>
        )}
      </div>
    </div>
  );
}
