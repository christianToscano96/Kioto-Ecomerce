import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProductsStore } from '@/store/products';

const SaveIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const products = useProductsStore((state) => state.products);
  const isLoading = useProductsStore((state) => state.isLoading);
  const createProduct = useProductsStore((state) => state.createProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const fetchAdminProducts = useProductsStore((state) => state.fetchAdminProducts);

  const product = products?.find((p) => p._id === id);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    images: '',
    description: '',
    stock: '',
    published: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load product data for editing
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        images: product.images?.join('\n') || '',
        description: product.description || '',
        stock: product.stock?.toString() || '',
        published: product.published || false,
      });
    }
  }, [isEdit, product]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Se requiere un precio válido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Se requiere una cantidad válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData = {
      name: formData.name,
      price: Number(formData.price),
      images: formData.images.split('\n').filter(Boolean).map((url) => url.trim()),
      description: formData.description,
      stock: Number(formData.stock),
      published: formData.published,
    };

    try {
      if (isEdit) {
        await updateProduct(id!, submitData);
      } else {
        await createProduct(submitData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-on-surface">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>
          <XIcon />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
          </div>

          <div>
            <Input
              label="Precio ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              required
            />
          </div>

          <div>
            <Input
              label="Stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={errors.stock}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded border-outline-variant text-verde-bosque-600 focus:ring-verde-bosque-500"
            />
            <label htmlFor="published" className="ml-2 text-sm text-on-surface">
              Publicado
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
            URLs de Imágenes (una por línea)
          </label>
          <textarea
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
            rows={3}
            className="flex w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="flex w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.description && (
            <span className="text-sm text-terracota-600">{errors.description}</span>
          )}
        </div>

        {/* Image Preview */}
        {formData.images && (
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              Vista Previa de Imágenes
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.images.split('\n').filter(Boolean).map((url, index) => (
                <img
                  key={index}
                  src={url.trim()}
                  alt={`Vista ${index + 1}`}
                  className="h-20 w-20 object-cover rounded border border-outline-variant"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            <SaveIcon />
            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/products')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}