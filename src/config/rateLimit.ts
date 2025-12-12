import rateLimit from 'express-rate-limit';
import { env } from './env';

export const chatRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
