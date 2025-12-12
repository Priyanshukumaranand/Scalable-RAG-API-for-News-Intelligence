import { createApp } from './app';
import { env } from './config/env';
import { ensureSchema } from './config/db';
import { startIngestionWorker } from './queues/ingestionQueue';

async function bootstrap() {
  await ensureSchema();
  startIngestionWorker();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
