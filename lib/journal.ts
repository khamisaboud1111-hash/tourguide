export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  coverSeed: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  author: string;
  draft?: boolean;
  content: string; // minimal markdown-like plain text for now
};

// Journal posts come from the CMS (lib/journal-db). No placeholder/fake articles are shipped.

export const journalArticles: JournalArticle[] = [];

export function getArticle(slug: string) {
  return journalArticles.find((a) => a.slug === slug);
}
