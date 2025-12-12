import { ChromaClient, Collection } from 'chromadb';
import { env } from './env';

const client = new ChromaClient({ path: env.chromaUrl });
const COLLECTION_NAME = 'news-articles';

export async function getNewsCollection(): Promise<Collection> {
  try {
    return await client.getCollection({ name: COLLECTION_NAME });
  } catch (err) {
    return client.createCollection({ name: COLLECTION_NAME });
  }
}
