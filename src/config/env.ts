import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: numberFromEnv('PORT', 3000),
  chromaUrl: process.env.CHROMA_URL || 'http://localhost:8000',
  postgresUrl: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/rag',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jinaApiKey: process.env.JINA_API_KEY || '',
  jinaModel: process.env.JINA_MODEL || 'jina-embeddings-v3',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  rateLimitWindowMs: numberFromEnv('RATE_LIMIT_WINDOW_MS', 60_000),
  rateLimitMax: numberFromEnv('RATE_LIMIT_MAX', 60),
};
