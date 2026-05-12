import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useCategoriesStore } from "@/store/categories";
import { showToast } from "@/components/ui/Toast";

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

export function CategoriesList() {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const error = useCategoriesStore((state) => state.error);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await deleteCategory(id);
        showToast({ type: 'success', title: 'Categoría eliminada' });
      } catch (error) {
        showToast({ type: 'error', title: 'Error al eliminar categoría' });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-on-surface">
          Categorías
        </h1>
        <Link to="/admin/categories/new">
          <Button>
            <PlusIcon />
            Nueva Categoría
          </Button>
        </Link>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/40 overflow-hidden">
        <table className="w-full">
<thead className="bg-surface-container">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                   Imagen
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                   Nombre
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                   Slug
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                   Acciones
                 </th>
               </tr>
             </thead>
<tbody className="divide-y divide-outline-variant/40">
             {categories.map((category) => (
               <tr key={category._id} className="hover:bg-surface-container-low">
                 <td className="px-6 py-4">
                   {category.imageUrl ? (
                     <img
                       src={category.imageUrl}
                       alt={category.name}
                       className="h-10 w-10 object-cover rounded"
                       onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none';
                       }}
                     />
                   ) : (
                     <div className="h-10 w-10 bg-surface-container rounded flex items-center justify-center text-on-surface-variant text-xs">
                       Sin img
                     </div>
                   )}
                 </td>
                 <td className="px-6 py-4 font-medium text-on-surface">
                   {category.name}
                 </td>
                 <td className="px-6 py-4 text-on-surface-variant">
                   /{category.slug}
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <Link to={`/admin/categories/${category._id}/edit`}>
                       <Button variant="ghost" size="sm">
                         <EditIcon />
                       </Button>
                     </Link>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleDelete(category._id)}
                     >
                       <TrashIcon />
                     </Button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>

        {categories.length === 0 && (
          <div className="p-8 text-center text-on-surface-variant">
            <p className="mb-4">No hay categorías. Crea tu primera categoría.</p>
            <Link to="/admin/categories/new">
              <Button>Crear primera categoría</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}