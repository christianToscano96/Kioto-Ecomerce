import React, { useState, useEffect } from "react";
import { useCartStore } from "../../store/cart";

interface ComboProductsDrawerProps {
  combo: {
    _id: string;
    name: string;
    comboPrice: number;
    products: Array<{
      _id: string;
      name: string;
      price: number;
      images: string[];
      description?: string;
    } | string>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ComboProductsDrawer({ combo, isOpen, onClose }: ComboProductsDrawerProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  // Initialize all products with quantity 1
  useEffect(() => {
    if (isOpen && combo.products) {
      const initialQuantities: Record<string, number> = {};
      combo.products.forEach((p, idx) => {
        const id = typeof p === 'string' ? p : p._id;
        initialQuantities[id] = 1;
      });
      setSelectedProducts(initialQuantities);
    }
  }, [isOpen, combo]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Add all products to cart
      const productPromises = combo.products.map(async (p) => {
        if (typeof p === 'string') return null;
        const quantity = selectedProducts[p._id] || 1;
        return addToCart(p as any, quantity);
      });
      
      await Promise.all(productPromises);
      onClose();
    } catch (error) {
      console.error('Error adding combo to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const calculateTotal = () => {
    return combo.products.reduce((total, p) => {
      if (typeof p === 'string') return total;
      const quantity = selectedProducts[p._id] || 1;
      return total + (p.price * quantity);
    }, 0);
  };

  const productList = combo.products.map((p, idx) => {
    if (typeof p === 'string') return null;
    return {
      ...p,
      selectedQuantity: selectedProducts[p._id] || 1
    };
  }).filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <h2 className="font-serif font-bold text-2xl text-on-surface">
              {combo.name}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface">close</span>
            </button>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-sm text-on-surface-variant mb-4">
              Agrega todos los productos al carrito
            </p>
            
            <div className="space-y-4">
              {productList.map((product) => (
                <div key={product!._id} className="flex gap-4 p-3 bg-surface-container rounded-xl">
                  <img
                    src={product!.images?.[0] || '/placeholder.png'}
                    alt={product!.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-on-surface">{product!.name}</h4>
                    <p className="text-sm text-primary font-bold">
                      ${product!.price.toLocaleString()}
                    </p>
                    
                    {/* Quantity selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(product!._id, -1)}
                        className="w-8 h-8 rounded-full bg-primary-container hover:bg-primary-container/80 flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">remove</span>
                      </button>
                      <span className="w-8 text-center font-medium">
                        {product!.selectedQuantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product!._id, 1)}
                        className="w-8 h-8 rounded-full bg-primary-container hover:bg-primary-container/80 flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Add to Cart */}
          <div className="p-6 border-t border-outline-variant/20 bg-surface-container">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant">Total productos</span>
              <span className="text-2xl font-serif font-bold text-primary">
                ${calculateTotal().toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant">Precio combo</span>
              <span className="text-lg font-medium text-primary">
                ${combo.comboPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="p-3 bg-primary-container rounded-xl mb-4">
              <p className="text-center text-primary font-medium">
                ¡Ahorras ${(calculateTotal() - combo.comboPrice).toLocaleString()}!
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-medium text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Agregando...
                </>
              ) : (
                <>
                  Agregar combo al carrito
                  <span className="material-symbols-outlined">shopping_cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}