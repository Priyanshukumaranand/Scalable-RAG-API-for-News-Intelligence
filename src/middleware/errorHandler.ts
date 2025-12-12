import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';

// Centralized error responder.
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
