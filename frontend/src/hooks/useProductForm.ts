import { useState, useEffect } from 'react';
import type { Product } from '@shared/index';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'];
const FOOTWEAR_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];

export type SizeType = 'tops' | 'bottoms' | 'footwear' | 'custom';

const SIZE_PRESETS: Record<SizeType, string[]> = {
  tops: PRESET_SIZES,
  bottoms: BOTTOM_SIZES,
  footwear: FOOTWEAR_SIZES,
  custom: [],
};

interface ProductFormData {
  name: string;
  price: string;
  images: string[];
  description: string;
  stock: string;
  published: boolean;
  materials: string;
  hasSizes: boolean;
  sizeType: SizeType;
  sizeStock: Record<string, number>;
  sizes: string[];
  colors: string[];
  category: string;
}

interface UseProductFormProps {
  product?: Product | null;
  isEdit: boolean;
}

export function useProductForm({ product, isEdit }: UseProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    images: [],
    description: '',
    stock: '',
    published: false,
    materials: '',
    hasSizes: false,
    sizeType: 'tops',
    sizeStock: {},
    sizes: [],
    colors: [],
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && product) {
      const hasSizes = product.variants && product.variants.length > 0;
      const sizeStock = hasSizes && product.variants
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

  const validate = (): boolean => {
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

  const updateSizeStock = (size: string, stock: number) => {
    setFormData(prev => ({
      ...prev,
      sizeStock: { ...prev.sizeStock, [size]: stock }
    }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const updateImage = (index: number, url: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = url;
      return { ...prev, images: newImages };
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getSubmitData = () => ({
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
  });

  return {
    formData,
    setFormData,
    errors,
    validate,
    toggleSize,
    removeColor,
    updateSizeStock,
    addImage,
    updateImage,
    removeImage,
    getSubmitData,
    SIZE_PRESETS,
  };
}