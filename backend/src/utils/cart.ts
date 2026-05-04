import { Types } from 'mongoose';
import Cart, { ICart } from '../models/Cart';
import { ICartItem } from '../models/types';

/**
 * Get or create a cart for a session
 */
export const getOrCreateCart = async (sessionId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }

  return cart;
};

/**
 * Add an item to the cart
 */
export const addToCart = async (
  sessionId: string,
  productId: Types.ObjectId,
  quantity: number,
  price: number,
  size?: string
): Promise<ICart> => {
  const cart = await getOrCreateCart(sessionId);

  // Check if item already exists in cart (same product + same size)
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString() && 
    (item as any).size === size
  );

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      productId,
      quantity,
      price,
      size,
    } as any);
  }

  return cart.save();
};

/**
 * Update a cart item quantity
 */
export const updateCartItem = async (
  sessionId: string,
  productId: Types.ObjectId,
  quantity: number
): Promise<ICart> => {
  const cart = await Cart.findOne({ sessionId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  return cart.save();
};

/**
 * Remove an item from the cart
 */
export const removeFromCart = async (
  sessionId: string,
  productId: Types.ObjectId
): Promise<ICart> => {
  const cart = await Cart.findOne({ sessionId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  );

  return cart.save();
};

/**
 * Clear the entire cart
 */
export const clearCart = async (sessionId: string): Promise<void> => {
  await Cart.findOneAndDelete({ sessionId });
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (items: ICartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Get cart item count
 */
export const getCartItemCount = (items: ICartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};