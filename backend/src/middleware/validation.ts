import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Validation middleware factory
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'issues' in error) {
        // Zod validation error
        const zodError = error as { issues: Array<{ path: (string | number | symbol)[], message: string }> };
        res.status(400).json({
          error: 'Validation failed',
          details: zodError.issues.map(e => ({
            path: e.path.filter((p): p is string | number => typeof p === 'string' || typeof p === 'number').join('.'),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};