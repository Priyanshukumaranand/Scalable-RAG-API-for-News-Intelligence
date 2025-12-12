import Parser from 'rss-parser';
import { randomUUID } from 'crypto';
import { ArticleInput } from '../types/article';
import { embedTexts } from './embeddingService';
import { upsertArticles } from './vectorService';
import sampleNews from '../data/sample-news.json';

const parser = new Parser();
const FEEDS = [
  'https://www.reutersagency.com/feed/?best-topics=technology',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://feeds.a.dj.com/rss/RSSWSJD.xml'
];

async function fetchFromFeeds(limit = 50): Promise<ArticleInput[]> {
  const all: ArticleInput[] = [];
  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed);
      parsed.items.forEach((item) => {
        if (!item.title || !item.link || !item.contentSnippet) return;
        if (all.length >= limit) return;
        all.push({
          id: randomUUID(),
          title: item.title,
          url: item.link,
          publishedAt: item.isoDate,
          content: item.contentSnippet,
        });
      });
      if (all.length >= limit) break;
    } catch (_err) {
      // fall back silently; we'll use mock data if feeds fail
    }
  }
  return all;
}

export async function ingestNews(): Promise<{ count: number }> {
  const fromFeeds = await fetchFromFeeds();
  const articles: ArticleInput[] = fromFeeds.length > 0 ? fromFeeds : (sampleNews as ArticleInput[]);
  const texts = articles.map((a) => `${a.title}\n${a.content}`);
  const embeddings = await embedTexts(texts);
  await upsertArticles(articles, embeddings);
  return { count: articles.length };
}
