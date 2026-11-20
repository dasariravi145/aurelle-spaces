/**
 * Journal Module Contracts
 * Defines editorial articles, design philosophies, and architectural essays.
 */

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  readingTimeMinutes: number;
  coverImage?: string;
  tags: string[];
}

