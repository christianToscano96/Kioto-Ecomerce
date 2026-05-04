import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import { validate } from '../middleware/validation';
import { productQuerySchema } from '../schemas/product';

const router = Router();

// GET /api/public/products - List published products with pagination
router.get('/products', validate(productQuerySchema), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    // Build query - only published products
    const query: Record<string, unknown> = { published: true };

    // Add search functionality if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/public/products/:slug - Get single product by slug
router.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Find product by slug, only if published
    const product = await Product.findOne({ slug, published: true }).select('-__v');

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;