import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';

// Hook to get cart data
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get cart total
export const useCartTotal = () => {
  const { data: cart } = useCart();
  return cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;
};

// Hook to get cart item count
export const useCartItemCount = () => {
  const { data: cart } = useCart();
  return cart?.items?.reduce((count, item) => count + item.quantity, 0) ?? 0;
};

// Hook to add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook to update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook to remove cart item
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook to clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
