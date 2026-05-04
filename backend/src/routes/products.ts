import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import { authenticate, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createProductSchema, updateProductSchema } from '../schemas/product';

const router = Router();

// Apply authentication and admin role to all routes
router.use(authenticate, adminOnly);

// GET /api/products - List all products (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', validate(createProductSchema), async (req: Request, res: Response) => {
  try {
    const { name, price, images, description, stock, published } = req.body;

    // Create product - slug is auto-generated from name by pre-save hook
    const product = await Product.create({
      name,
      price,
      images: images || [],
      description,
      stock,
      published,
    });

    res.status(201).json({ product });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      // Duplicate key error (slug already exists)
      res.status(409).json({ error: 'Product with this name already exists' });
      return;
    }
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', validate(updateProductSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ error: 'Product with this name already exists' });
      return;
    }
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;