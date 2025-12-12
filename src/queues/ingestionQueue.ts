import { Queue, Worker } from 'bullmq';
import { env } from '../config/env';
import { ingestNews } from '../services/ingestionService';

const queueEnabled = process.env.NODE_ENV !== 'test' && process.env.DISABLE_QUEUE !== 'true';

const redisUrl = new URL(env.redisUrl);
const connection = {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    password: redisUrl.password || undefined,
  },
};

export const ingestionQueue = queueEnabled ? new Queue('ingestion', connection) : null;

export function startIngestionWorker() {
  if (!queueEnabled || !ingestionQueue) return null;

  const worker = new Worker(
    'ingestion',
    async () => {
      await ingestNews();
    },
    connection,
  );

  worker.on('error', (err) => {
    console.error('Ingestion worker error', err);
  });

  return worker;
}

export const isQueueEnabled = queueEnabled;
