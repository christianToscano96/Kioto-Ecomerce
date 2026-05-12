import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import User, { IUser } from '../models/User';

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  cookies: {
    token?: string;
  };
}

// HTTP-only cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Authenticate middleware - verifies JWT from HTTP-only cookie
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Authorize middleware - checks for required role
export const authorize = (roles: ('admin' | 'user')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize(['admin']);

// Helper to set auth cookie
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, cookieOptions);
};

// Helper to clear auth cookie
export const clearAuthCookie = (res: Response): void => {
  res.clearCookie('token', { path: '/' });
};

export { cookieOptions };