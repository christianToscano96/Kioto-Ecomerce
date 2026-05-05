import { Types } from 'mongoose';
import Cart, { ICart } from '../models/Cart';
import { ICartItem } from '../models/types';
import Product from '../models/Product';

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
 * Add an item to the cart with stock and price validation
 */
export const addToCart = async (
  sessionId: string,
  productId: Types.ObjectId,
  quantity: number,
  price: number,
  size?: string
): Promise<ICart> => {
  // Verify product exists and stock is available
  const product = await Product.findOne({ _id: productId, published: true });
  if (!product) {
    throw new Error('Product not found or not available');
  }
  
  if (product.stock < quantity) {
    throw new Error(`Requested quantity exceeds available stock. Available: ${product.stock}`);
  }
  
  // Verify price matches current product price
  if (product.price !== price) {
    throw new Error('Price has changed. Please refresh and try again.');
  }
  
  const cart = await getOrCreateCart(sessionId);
  
  // Check if item already exists in cart (same product + same size)
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString() && 
    (item as any).size === size
  );
  
  if (existingItemIndex >= 0) {
    // Check if total quantity exceeds stock
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQuantity) {
      throw new Error(`Total quantity would exceed available stock. Available: ${product.stock}`);
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
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
 * Update a cart item quantity by cart item _id (subdocument id)
 * Falls back to productId matching for carts created before _id was added to items
 * With stock validation
 */
export const updateCartItem = async (
  sessionId: string,
  cartItemId: Types.ObjectId,
  quantity: number
): Promise<ICart> => {
  const cart = await Cart.findOne({ sessionId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item._id?.toString() === cartItemId.toString() ||
            (item._id === undefined && item.productId.toString() === cartItemId.toString())
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  // Verify stock availability
  const product = await Product.findById(cart.items[itemIndex].productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (product.stock < quantity) {
    throw new Error(`Requested quantity exceeds available stock. Available: ${product.stock}`);
  }

  // Verify price hasn't changed
  if (product.price !== cart.items[itemIndex].price) {
    throw new Error('Price has changed. Please refresh and try again.');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  return cart.save();
};

/**
 * Remove an item from the cart by cart item _id (subdocument id)
 * Falls back to productId matching for carts created before _id was added to items
 */
export const removeFromCart = async (
  sessionId: string,
  cartItemId: Types.ObjectId
): Promise<ICart> => {
  const cart = await Cart.findOne({ sessionId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item._id?.toString() === cartItemId.toString() ||
            (item._id === undefined && item.productId.toString() === cartItemId.toString())
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  cart.items.splice(itemIndex, 1);

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