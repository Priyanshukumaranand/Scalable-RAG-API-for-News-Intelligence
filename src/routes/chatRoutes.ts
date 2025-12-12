import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { HttpError } from '../utils/httpError';
import { answerChat, getHistory, clearHistory } from '../services/chatService';
import { chatRateLimiter } from '../config/rateLimit';

const router = Router();

const chatSchema = z.object({
  sessionId: z.string().min(1),
  query: z.string().min(3),
});

router.post(
  '/chat',
  chatRateLimiter,
  asyncHandler(async (req, res) => {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, 'Invalid payload');
    }
    const { sessionId, query } = parsed.data;
    const result = await answerChat(sessionId, query);
    res.status(200).json(result);
  }),
);

router.get(
  '/history/:sessionId',
  asyncHandler(async (req, res) => {
    const sessionId = req.params.sessionId;
    if (!sessionId) throw new HttpError(400, 'SessionId required');
    const history = await getHistory(sessionId);
    res.status(200).json({ history });
  }),
);

router.delete(
  '/history/:sessionId',
  asyncHandler(async (req, res) => {
    const sessionId = req.params.sessionId;
    if (!sessionId) throw new HttpError(400, 'SessionId required');
    await clearHistory(sessionId);
    res.status(204).send();
  }),
);

export default router;
