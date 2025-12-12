import { redis } from '../config/redis';
import { env } from '../config/env';
import { embedTexts } from './embeddingService';
import { queryArticles } from './vectorService';
import { generateAnswer } from './llmService';
import { pgPool } from '../config/db';

interface ChatResult {
  answer: string;
  sources: Array<{ title?: string; url?: string | null }>;
}

const SESSION_TTL_SECONDS = 60 * 30;

async function fetchContext(sessionId: string): Promise<string[]> {
  const key = `chat:${sessionId}`;
  const data = await redis.lrange(key, 0, -1);
  return data;
}

async function pushContext(sessionId: string, entry: string) {
  const key = `chat:${sessionId}`;
  await redis.rpush(key, entry);
  await redis.expire(key, SESSION_TTL_SECONDS);
}

export async function answerChat(sessionId: string, query: string): Promise<ChatResult> {
  const [queryEmbedding] = await embedTexts([query]);
  const results = await queryArticles(queryEmbedding, 4);

  const sources = (results?.metadatas?.[0] || []).map((m: any) => ({ title: m.title, url: m.url }));
  const docs = (results?.documents?.[0] || []) as string[];

  const history = await fetchContext(sessionId);
  const contextBlock = history.join('\n');
  const retrievedBlock = docs
    .map((doc, idx) => `Source ${idx + 1}: ${doc}`)
    .join('\n');

  const prompt = `You are a concise news assistant. Use the provided sources.\n` +
    `History:\n${contextBlock}\n` +
    `User: ${query}\n` +
    `Sources:\n${retrievedBlock}\n` +
    `Answer with a short paragraph and cite titles where relevant.`;

  const start = Date.now();
  const answer = await generateAnswer(prompt);
  const responseTime = Date.now() - start;

  await pushContext(sessionId, `Q: ${query}\nA: ${answer}`);

  await pgPool.query(
    'insert into interactions (session_id, user_query, llm_response, response_time_ms, source_documents) values ($1, $2, $3, $4, $5)',
    [sessionId, query, answer, responseTime, JSON.stringify(sources)],
  );

  return { answer, sources };
}

export async function getHistory(sessionId: string) {
  const res = await pgPool.query(
    'select id, created_at, session_id, user_query, llm_response, response_time_ms, source_documents from interactions where session_id = $1 order by created_at asc',
    [sessionId],
  );
  return res.rows;
}

export async function clearHistory(sessionId: string) {
  await pgPool.query('delete from interactions where session_id = $1', [sessionId]);
  await redis.del(`chat:${sessionId}`);
}
