import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ingestionQueue, isQueueEnabled } from '../queues/ingestionQueue';
import { ingestNews } from '../services/ingestionService';

const router = Router();

router.post(
  '/ingest',
  asyncHandler(async (_req, res) => {
    if (!isQueueEnabled || process.env.DISABLE_QUEUE === 'true') {
      const result = await ingestNews();
      res.status(200).json({ queued: false, ...result });
      return;
    }

    await ingestionQueue!.add('run', {});
    res.status(202).json({ queued: true });
  }),
);

export default router;
