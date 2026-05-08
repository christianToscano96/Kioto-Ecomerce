import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Settings from '../models/Settings';

interface Settings {
  store?: {
    name?: string;
    logo?: string;
    currency?: string;
    timezone?: string;
    taxEnabled?: boolean;
    taxRate?: number;
    shipping?: {
      flatRate?: number;
      freeShippingOver?: number;
    };
  };
  email?: {
    user?: string;
    pass?: string;
    from?: string;
  };
  payments?: {
    stripe?: {
      testMode?: boolean;
      publishableKey?: string;
      secretKey?: string;
    };
  };
  notifications?: {
    orderEmails?: boolean;
    lowStockEmails?: boolean;
    webhookUrl?: string;
  };
  appearance?: {
    primaryColor?: string;
    darkMode?: boolean;
  };
  security?: {
    twoFactor?: boolean;
    apiKey?: string;
  };
  social?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
  };
  policies?: {
    terms?: string;
    privacy?: string;
  };
}

const router = Router();

// Default settings
const defaultSettings: Settings = {
  store: {
    name: 'KIOTO',
    logo: '',
    currency: 'USD',
    timezone: 'America/Argentina',
    taxEnabled: false,
    taxRate: 0,
    shipping: {
      flatRate: 500,
      freeShippingOver: 5000,
    },
  },
  email: {
    user: '',
    pass: '',
    from: '',
  },
  payments: {
    stripe: {
      testMode: true,
      publishableKey: '',
      secretKey: '',
    },
  },
  notifications: {
    orderEmails: true,
    lowStockEmails: true,
    webhookUrl: '',
  },
  appearance: {
    primaryColor: '#1976d2',
    darkMode: false,
  },
  security: {
    twoFactor: false,
    apiKey: '',
  },
  social: {
    instagram: '',
    whatsapp: '',
    facebook: '',
  },
  policies: {
    terms: '',
    privacy: '',
  },
};

// Get settings (authenticated only)
router.get('/', authenticate, async (_req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings
      settings = await Settings.create(defaultSettings);
    }
    res.json(settings.toObject());
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/', authenticate, async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings) {
      res.status(400).json({ error: 'Settings data required' });
      return;
    }

    let existingSettings = await Settings.findOne();
    if (existingSettings) {
      // Update existing
      Object.assign(existingSettings, settings);
      await existingSettings.save();
      res.json(existingSettings.toObject());
    } else {
      // Create new
      const newSettings = await Settings.create(settings);
      res.json(newSettings.toObject());
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;