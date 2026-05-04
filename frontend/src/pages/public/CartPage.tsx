import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCart, useUpdateCartItem, useRemoveFromCart, useCartTotal, useCartItemCount } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/PublicHeader';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-terracota-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveFromCart();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem.mutateAsync({ itemId, quantity });
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeCartItem.mutateAsync(itemId);
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-crema-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-crema-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg text-center">
              Error loading cart. Please try again.
            </div>
          </div>
        </div>
      </>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-crema-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">Your Cart is Empty</h1>
              <p className="text-chocolate-600 mb-8">Discover our curated collection of handcrafted goods.</p>
              <Link to="/products">
                <Button size="lg">Shop Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-crema-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">Your Cart is Empty</h1>
              <p className="text-chocolate-600 mb-8">Discover our curated collection of handcrafted goods.</p>
              <Link to="/products">
                <Button size="lg">Shop Products</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-8">Shopping Cart</h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Table */}
                <div className="lg:col-span-2">
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-chocolate-200">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-chocolate-700">Product</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-chocolate-700">Price</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-chocolate-700">Quantity</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-chocolate-700">Total</th>
                            <th className="w-16"></th>
                          </tr>
                        </thead>
<tbody>
                           {items.map((item) => (
                             <tr key={item.productId} className="border-b border-chocolate-100 last:border-0">
                               <td className="py-4 px-4">
                                 <div className="flex items-center gap-3">
                                   <div className="w-16 h-16 bg-arena-100 rounded border border-arena-200 flex-shrink-0 overflow-hidden">
                                     {item?.product?.images?.[0] ? (
                                       <img
                                         src={item.product.images[0]}
                                         alt={item.product.name || 'Product'}
                                         className="w-full h-full object-cover"
                                       />
                                     ) : (
                                       <div className="w-full h-full flex items-center justify-center text-chocolate-400 text-xs">
                                         No image
                                       </div>
                                     )}
                                   </div>
                                   <span className="font-medium text-chocolate-900">
                                     {item?.product?.name || 'Product'}
                                   </span>
                                 </div>
                               </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-terracota-600 font-medium">
                                  {formatPrice(item.price)}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex justify-center">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                                    className="w-16 text-center"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-medium text-chocolate-900">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => handleRemoveItem(item.productId)}
                                  className="text-chocolate-400 hover:text-terracota-600 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <TrashIcon />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Order Summary */}
                <div>
                  <Card>
                    <h2 className="text-xl font-serif font-semibold text-chocolate-900 mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-chocolate-600">Items ({cartItemCount})</span>
                        <span className="text-chocolate-900">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="border-t border-dashed border-chocolate-200 pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-chocolate-900">Total</span>
                          <span className="text-terracota-600">{formatPrice(cartTotal)}</span>
                        </div>
                      </div>
                    </div>
                    <Link to="/checkout" className="block">
                      <Button size="lg" className="w-full">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}