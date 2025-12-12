import express from 'express';
import ingestionRoutes from './routes/ingestionRoutes';
import chatRoutes from './routes/chatRoutes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(ingestionRoutes);
  app.use(chatRoutes);

  app.use(errorHandler);

  return app;
}
