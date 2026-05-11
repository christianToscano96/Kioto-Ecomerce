import { Router, Request, Response } from 'express';
import Combo, { ICombo } from '../models/Combo';
import Product from '../models/Product';
import { validate } from '../middleware/validation';
import { createComboSchema, updateComboSchema } from '../schemas/combo';

const router = Router();

// Calculate combo prices
async function calculateComboPrices(productIds: string[], discount: number): Promise<{ originalPrice: number; comboPrice: number }> {
  const products = await Product.find({ _id: { $in: productIds } });
  const originalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const comboPrice = Math.round(originalPrice * (1 - discount / 100));
  return { originalPrice, comboPrice };
}

// GET /api/combos - List all combos (admin)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const combos = await Combo.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({ combos });
  } catch (error) {
    console.error('Error fetching combos:', error);
    res.status(500).json({ error: 'Failed to fetch combos' });
  }
});

// POST /api/combos - Create combo
router.post('/', validate(createComboSchema), async (req: Request, res: Response) => {
  try {
    const { products, discount, ...rest } = req.body;

    // Calculate prices
    const { originalPrice, comboPrice } = await calculateComboPrices(products, discount);

    const combo = await Combo.create({
      ...rest,
      products,
      discount,
      originalPrice,
      comboPrice,
    });

    res.status(201).json({ combo });
  } catch (error) {
    console.error('Error creating combo:', error);
    res.status(500).json({ error: 'Failed to create combo' });
  }
});

// PUT /api/combos/:id - Update combo
router.put('/:id', validate(updateComboSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { products, discount, ...rest } = req.body;

    const updateData: Partial<ICombo> = { ...rest };

    // Recalculate prices if products or discount changed
    if (products || discount !== undefined) {
      const newProducts = products || [];
      const comboDiscount = discount ?? 0;
      const { originalPrice, comboPrice } = await calculateComboPrices(newProducts, comboDiscount);
      updateData.originalPrice = originalPrice;
      updateData.comboPrice = comboPrice;
      if (products) updateData.products = products;
      if (discount !== undefined) updateData.discount = discount;
    }

    const combo = await Combo.findByIdAndUpdate(id, updateData, { new: true });

    if (!combo) {
      res.status(404).json({ error: 'Combo not found' });
      return;
    }

    res.status(200).json({ combo });
  } catch (error) {
    console.error('Error updating combo:', error);
    res.status(500).json({ error: 'Failed to update combo' });
  }
});

// DELETE /api/combos/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const combo = await Combo.findByIdAndDelete(id);

    if (!combo) {
      res.status(404).json({ error: 'Combo not found' });
      return;
    }

    res.status(200).json({ message: 'Combo deleted' });
  } catch (error) {
    console.error('Error deleting combo:', error);
    res.status(500).json({ error: 'Failed to delete combo' });
  }
});

export default router;