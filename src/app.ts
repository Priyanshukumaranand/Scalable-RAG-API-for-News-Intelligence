import express from 'express';
import swaggerUi from 'swagger-ui-express';
import ingestionRoutes from './routes/ingestionRoutes';
import chatRoutes from './routes/chatRoutes';
import { errorHandler } from './middleware/errorHandler';
import openapiDocument from './docs/openapi';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.get('/docs.json', (_req, res) => {
    res.status(200).json(openapiDocument);
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(ingestionRoutes);
  app.use(chatRoutes);

  app.use(errorHandler);

  return app;
}
