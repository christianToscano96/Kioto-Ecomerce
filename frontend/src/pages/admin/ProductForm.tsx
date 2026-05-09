import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useProductsStore } from '@/store/products';
import { useCategoriesStore } from '@/store/categories';
import type { Product } from '../../../../shared/src';

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

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'];
const FOOTWEAR_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];

type SizeType = 'tops' | 'bottoms' | 'footwear' | 'custom';

const SIZE_PRESETS: Record<SizeType, string[]> = {
  tops: PRESET_SIZES,
  bottoms: BOTTOM_SIZES,
  footwear: FOOTWEAR_SIZES,
  custom: [],
};

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const products = useProductsStore((state) => state.products);
  const isLoading = useProductsStore((state) => state.isLoading);
  const createProduct = useProductsStore((state) => state.createProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const fetchAdminProducts = useProductsStore((state) => state.fetchAdminProducts);

  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const product = products?.find((p: Product) => p._id === id);

  useEffect(() => {
    fetchAdminProducts();
    fetchCategories();
  }, [fetchAdminProducts, fetchCategories]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    images: [] as string[],
    description: '',
    stock: '',
    published: false,
    materials: '',
    hasSizes: false,
    sizeType: 'tops' as SizeType,
    sizeStock: {} as Record<string, number>,
    sizes: [] as string[],
    colors: [] as string[],
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

// Load product data for editing
   useEffect(() => {
      if (isEdit && product) {
        // Check if product has variants (size-based stock) or simple stock
        const hasSizes = product.variants && product.variants.length > 0;
        const sizeStock = hasSizes 
          ? product.variants.reduce((acc: Record<string, number>, v: any) => {
              acc[v.size] = v.stock || 0;
              return acc;
            }, {})
          : {};
        
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          images: product.images || [],
          description: product.description || '',
          stock: product.stock?.toString() || '',
          published: product.published || false,
          materials: product.materials || '',
          hasSizes: hasSizes || false,
          sizeType: 'tops',
          sizeStock: sizeStock,
          sizes: product.sizes || [],
          colors: product.colors || [],
          category: typeof product.category === 'object' ? product.category?._id : product.category || '',
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
    if (!formData.hasSizes && (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
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
      images: formData.images.filter(Boolean),
      description: formData.description,
      stock: formData.hasSizes ? 0 : Number(formData.stock),
      published: formData.published,
      materials: formData.materials,
      sizes: formData.hasSizes ? Object.keys(formData.sizeStock) : formData.sizes,
      colors: formData.colors,
      category: formData.category || undefined,
      variants: formData.hasSizes 
        ? Object.entries(formData.sizeStock).map(([size, stock]) => ({ size, stock }))
        : undefined,
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

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-on-surface">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {isEdit ? 'ID: ' + id?.slice(-6) : 'Completa la información del producto'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
          <XIcon />
          Cancelar
        </Button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="flex-1 space-y-4">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
            <h2 className="text-base font-serif font-bold text-on-surface mb-4">Información Básica</h2>
            
            <div className="space-y-4">
              <Input
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <div className="grid grid-cols-2 gap-4">
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
                
                {!formData.hasSizes && (
                  <Input
                    label="Stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    error={errors.stock}
                    required
                  />
                )}
              </div>

              <Input
                label="Materiales"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="100% Algodón orgánico, Lino belga..."
              />

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Características, estilo, detalles..."
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {errors.description && (
                  <span className="text-sm text-terracota-600">{errors.description}</span>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-outline-variant text-verde-bosque-600 focus:ring-verde-bosque-500"
                />
                <label htmlFor="published" className="ml-2 text-sm font-medium text-on-surface">
                  Publicado en tienda
                </label>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

{/* Variantes */}
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
            <h2 className="text-base font-serif font-bold text-on-surface mb-4">Variantes</h2>
            
            <div className="space-y-4">
              {/* Has Sizes Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasSizes"
                  checked={formData.hasSizes}
                  onChange={(e) => setFormData({ ...formData, hasSizes: e.target.checked })}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <label htmlFor="hasSizes" className="ml-2 text-sm font-medium text-on-surface">
                  Este producto tiene tallas
                </label>
              </div>

              {/* Size Type Selector - Only show if hasSizes */}
              {formData.hasSizes && (
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Tipo de Tallas
                  </label>
                  <select
                    value={formData.sizeType}
                    onChange={(e) => setFormData({ ...formData, sizeType: e.target.value as SizeType })}
                    className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="tops">Prenda superior (XS-XXL)</option>
                    <option value="bottoms">Prenda inferior (28-42)</option>
                    <option value="footwear">Calzado (5-12 US)</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
              )}

              {/* Size Stock Table - Only show if hasSizes */}
              {formData.hasSizes && (
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Stock por Talla
                  </label>
                  <div className="border border-outline-variant/40 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-surface-container">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-on-surface-variant">Talla</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-on-surface-variant">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(formData.sizeType === 'custom' 
                          ? formData.sizes 
                          : SIZE_PRESETS[formData.sizeType]
                        ).map((size) => (
                          <tr key={size} className="border-t border-outline-variant/20">
                            <td className="px-3 py-2 text-sm font-medium text-on-surface">{size}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="0"
                                value={formData.sizeStock[size] || 0}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  sizeStock: {
                                    ...formData.sizeStock,
                                    [size]: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full rounded border border-outline px-2 py-1 text-sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Custom sizes input */}
                  {formData.sizeType === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Agregar talla (ej: S, M, L)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const size = (e.target as HTMLInputElement).value.trim();
                            if (size && !formData.sizes.includes(size)) {
                              setFormData({
                                ...formData,
                                sizes: [...formData.sizes, size],
                                sizeStock: { ...formData.sizeStock, [size]: 0 }
                              });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm"
                      />
                      <p className="text-xs text-on-surface-variant mt-1">Presiona Enter para agregar talla</p>
                    </div>
                  )}
                </div>
              )}

              {/* Colors - keep existing */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">
                  Colores
                </label>

                {/* Predefined color palette */}
                <div className="mb-3">
                  <p className="text-xs text-on-surface-variant mb-2">Paleta rápida:</p>
                  <div className="flex flex-wrap gap-2">
                    {['#000000', '#FFFFFF', '#99452c', '#2e6b4f', '#c27e41', '#6b7280', '#dc2626', '#2563eb', '#7c3aed', '#ca8a04', '#059669', '#db2777'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (!formData.colors.includes(color)) {
                            setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }));
                          }
                        }}
                        className="w-8 h-8 rounded-full border-2 border-outline hover:border-primary transition-all shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Color input nativo + manual input */}
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="color"
                    value="#99452c"
                    onChange={(e) => {
                      const color = e.target.value;
                      if (!formData.colors.includes(color)) {
                        setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }));
                      }
                    }}
                    className="h-10 w-12 rounded-lg border border-outline cursor-pointer"
                  />
                  <Input
                    type="text"
                    placeholder="#99452c"
                    onChange={(e) => {
                      const color = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(color) && !formData.colors.includes(color)) {
                        setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }));
                        e.target.value = ''; // Clear after adding
                      }
                    }}
                    className="flex-1 text-xs font-mono"
                  />
                </div>

                {/* Selected colors preview with remove button */}
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-outline-variant/40">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-outline-variant shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-terracota-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.colors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, colors: [] }))}
                    className="text-xs text-terracota-600 hover:text-terracota-700 mt-2"
                  >
                    Limpiar todos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

{/* Columna derecha - Imágenes */}
         <div className="w-full lg:w-80 space-y-4">
           <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
             <h2 className="text-base font-serif font-bold text-on-surface mb-4">Imágenes del Producto</h2>
             
             <div className="space-y-3">
               {/* Existing images */}
               {formData.images.map((img, index) => (
                 <ImageUpload
                   key={index}
                   label={`Imagen ${index + 1}`}
                   currentImage={img}
                   onUpload={(url) => {
                     const newImages = [...formData.images];
                     newImages[index] = url;
                     setFormData({ ...formData, images: newImages });
                   }}
                   onRemove={() => {
                     setFormData(prev => ({
                       ...prev,
                       images: prev.images.filter((_, i) => i !== index),
                     }));
                   }}
                 />
               ))}
               
               {/* Add more images button */}
               {formData.images.length < 5 && (
                 <button
                   type="button"
                   onClick={() => {
                     setFormData(prev => ({
                       ...prev,
                       images: [...prev.images, ''],
                     }));
                   }}
                   className="text-xs text-primary hover:text-primary/80"
                 >
                   + Agregar imagen
                 </button>
               )}
             </div>
           </div>
         </div>
      </form>

      {/* Actions bar fijo abajo */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/60">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={isLoading} form="product-form">
          <SaveIcon />
          {isEdit ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </div>
  );
}