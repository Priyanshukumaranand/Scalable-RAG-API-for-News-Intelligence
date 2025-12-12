import { getNewsCollection } from '../config/vector';
import { ArticleInput } from '../types/article';

export async function upsertArticles(articles: ArticleInput[], embeddings: number[][]) {
  const collection = await getNewsCollection();
  await collection.upsert({
    ids: articles.map((a) => a.id),
    documents: articles.map((a) => `${a.title}\n${a.content}`),
    metadatas: articles.map((a) => ({ title: a.title, url: a.url, publishedAt: a.publishedAt || null })),
    embeddings,
  });
}

export async function queryArticles(queryEmbedding: number[], topK: number) {
  const collection = await getNewsCollection();
  return collection.query({ queryEmbeddings: [queryEmbedding], nResults: topK });
}
