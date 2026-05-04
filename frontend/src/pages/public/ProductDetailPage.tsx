import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useProduct, useAddToCart } from '@/lib/api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import type { Product } from '../../../../shared/src/index';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-terracota-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h14l-1.35 6.75a2 2 0 01-2 1.25H7.35a2 2 0 01-2-1.25L3 5H5" />
  </svg>
);

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: product, isLoading, error } = useProduct(id || '');
  const addToCartMutation = useAddToCart();

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCartMutation.mutateAsync({ productId: product._id, quantity });
      setQuantity(1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[600px]">
          <LoaderIcon />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg text-center">
            Product not found or error loading product.
          </div>
        </div>
      </>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [''];

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-crema-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="mb-4">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg bg-white"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImageIndex === index
                          ? 'border-terracota-600'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">{product.name}</h1>
              <p className="text-2xl text-terracota-600 font-medium mb-6">
                ${product.price.toFixed(2)}
              </p>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-chocolate-700 mb-2">Description</h2>
                <p className="text-chocolate-600">{product.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-chocolate-700 mb-2">Availability</h2>
                <p className={`text-sm ${product.stock > 0 ? 'text-terracota-600' : 'text-terracota-700'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              {/* Add to Cart Form */}
              {product.stock > 0 && (
                <Card className="p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        label="Quantity"
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        onClick={handleAddToCart}
                        disabled={addToCartMutation.isPending}
                        className="w-full"
                      >
                        <ShoppingCartIcon />
                        {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {product.stock === 0 && (
                <div className="p-4 bg-chocolate-100 text-chocolate-700 rounded-lg text-center">
                  This product is currently out of stock.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}