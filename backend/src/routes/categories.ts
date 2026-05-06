import { Router, Request, Response } from 'express';
import Category from '../models/Category';
import { authenticate, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createCategorySchema, updateCategorySchema } from '../schemas/category';

const router = Router();

// Public endpoint for testing (remove in production)
// GET /api/categories/public - List all categories
router.get('/public', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Public endpoint for creating categories (testing only)
router.post('/public', async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = req.body;

    const category = await Category.create({ name, imageUrl });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ error: 'Category with this name already exists' });
      return;
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Public endpoint for updating categories (testing only)
router.put('/public/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ error: 'Category with this name already exists' });
      return;
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Public endpoint for deleting categories (testing only)
router.delete('/public/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Apply authentication and admin role to all routes
router.use(authenticate, adminOnly);

// GET /api/categories - List all categories (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create category (admin only)
router.post('/', validate(createCategorySchema), async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = req.body;

    const category = await Category.create({ name, imageUrl });

    res.status(201).json({ category });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ error: 'Category with this name already exists' });
      return;
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', validate(updateCategorySchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({ category });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      res.status(409).json({ error: 'Category with this name already exists' });
      return;
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;