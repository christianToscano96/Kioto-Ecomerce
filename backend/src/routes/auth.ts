import { Router, Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { authenticate, setAuthCookie, clearAuthCookie, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../schemas/auth';

const router = Router();

// POST /api/auth/register - User registration with validation
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: 'user', // Default role
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Set HTTP-only cookie
    setAuthCookie(res, accessToken);

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    res.status(201).json({
      user: userResponse,
      refreshToken, // Refresh token returned in body for security (client stores)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/register-admin - Create admin user (development only)
router.post('/register-admin', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = await User.create({
      email,
      password,
      name,
      role: 'admin',
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    setAuthCookie(res, accessToken);

    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    res.status(201).json({
      user: userResponse,
      refreshToken,
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Login with credentials, set cookie
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Set HTTP-only cookie
    setAuthCookie(res, accessToken);

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    res.status(200).json({
      user: userResponse,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout - Clear cookie
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
});

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    // Verify refresh token and generate new access token
    const decoded = verifyToken(refreshToken);

    // Fetch user to ensure they still exist
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    setAuthCookie(res, accessToken);

    res.status(200).json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /api/auth/me - Get current authenticated user
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const userResponse = {
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
  };

  res.status(200).json({ user: userResponse });
});

// PUT /api/auth/profile - Update user profile (name, email)
router.put('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const updateData: { name?: string; email?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    const userResponse = {
      _id: user!._id,
      email: user!.email,
      role: user!.role,
      name: user!.name,
    };

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /api/auth/password - Change user password
router.put('/password', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

export default router;