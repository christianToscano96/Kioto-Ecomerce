import { Router, Request, Response } from 'express';
import Combo from '../models/Combo';

const router = Router();

// GET /api/public/combos - List active combos with products
router.get('/combos', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const combos = await Combo.find({
      active: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    })
      .populate('products', 'name price images')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({ combos });
  } catch (error) {
    console.error('Error fetching public combos:', error);
    res.status(500).json({ error: 'Failed to fetch combos' });
  }
});

// GET /api/public/combos/:id - Get single combo with products
router.get('/combos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const combo = await Combo.findById(id)
      .populate('products', 'name price images')
      .select('-__v');

    if (!combo) {
      res.status(404).json({ error: 'Combo not found' });
      return;
    }

    res.status(200).json({ combo });
  } catch (error) {
    console.error('Error fetching combo:', error);
    res.status(500).json({ error: 'Failed to fetch combo' });
  }
});

export default router;