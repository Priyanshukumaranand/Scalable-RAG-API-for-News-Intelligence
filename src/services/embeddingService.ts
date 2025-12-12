import axios from 'axios';
import { env } from '../config/env';

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!env.jinaApiKey) {
    // Deterministic fallback for development without API key.
    return texts.map((text) => Array.from({ length: 16 }, (_, i) => (text.length % (i + 7)) / 10));
  }

  const response = await axios.post(
    'https://api.jina.ai/v1/embeddings',
    {
      model: env.jinaModel,
      input: texts,
    },
    {
      headers: {
        Authorization: `Bearer ${env.jinaApiKey}`,
      },
    },
  );

  const data = response.data;
  if (!data?.data) {
    throw new Error('Failed to generate embeddings');
  }
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}
