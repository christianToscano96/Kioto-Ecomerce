import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCategoriesStore } from "@/store/categories";
import type { Category } from "../../../../shared/src";

const SaveIcon = () => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const createCategory = useCategoriesStore((state) => state.createCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const category = categories?.find((c: Category) => c._id === id);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load category data for editing
  useEffect(() => {
    if (isEdit && category) {
      setFormData({
        name: category.name || "",
        imageUrl: category.imageUrl || "",
      });
    }
  }, [isEdit, category]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEdit) {
        await updateCategory(id!, formData);
      } else {
        await createCategory(formData);
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-on-surface">
          {isEdit ? "Editar Categoría" : "Nueva Categoría"}
        </h1>
        <Button variant="ghost" onClick={() => navigate("/admin/categories")}>
          <XIcon />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/40">
          <div className="space-y-4">
            <Input
              label="Nombre de la Categoría"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              required
              placeholder="Ej: Camisas, Pantalones, Accesorios..."
            />
            
            <div>
              <Input
                label="URL de Imagen (Opcional)"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="h-32 w-32 object-cover rounded-lg border border-outline-variant"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            <SaveIcon />
            {isEdit ? "Actualizar Categoría" : "Crear Categoría"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/admin/categories")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}