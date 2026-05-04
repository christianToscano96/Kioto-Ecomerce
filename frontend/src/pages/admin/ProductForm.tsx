import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdminProducts, useCreateProduct, useUpdateProduct } from '@/lib/api';

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

  const { data: products } = useAdminProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const product = products?.find((p) => p._id === id);

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
      newErrors.name = 'Name is required';
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
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
        await updateMutation.mutateAsync({ id: id!, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-chocolate-900">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>
          <XIcon />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
          </div>

          <div>
            <Input
              label="Price ($)"
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
              className="h-4 w-4 rounded border-chocolate-300 text-verde-bosque-600 focus:ring-verde-bosque-500"
            />
            <label htmlFor="published" className="ml-2 text-sm text-chocolate-700">
              Published
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-chocolate-700 mb-1.5">
            Image URLs (one per line)
          </label>
          <textarea
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            rows={3}
            className="flex w-full rounded-lg border border-chocolate-300 bg-white px-3 py-2 text-sm text-chocolate-900 placeholder:text-chocolate-400 focus:outline-none focus:ring-2 focus:ring-verde-bosque-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-chocolate-700 mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="flex w-full rounded-lg border border-chocolate-300 bg-white px-3 py-2 text-sm text-chocolate-900 placeholder:text-chocolate-400 focus:outline-none focus:ring-2 focus:ring-verde-bosque-500 focus:border-transparent"
          />
          {errors.description && (
            <span className="text-sm text-terracota-600">{errors.description}</span>
          )}
        </div>

        {/* Image Preview */}
        {formData.images && (
          <div>
            <label className="block text-sm font-medium text-chocolate-700 mb-2">
              Image Preview
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.images.split('\n').filter(Boolean).map((url, index) => (
                <img
                  key={index}
                  src={url.trim()}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded border border-chocolate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            <SaveIcon />
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}