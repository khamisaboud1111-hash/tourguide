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

// No fake published articles — these are content slots the owner can replace.
// Each is marked draft:true and will render with a "Coming soon" badge until real copy is added.
// To publish: set draft:false and replace title/excerpt/content with real writing.

export const journalArticles: JournalArticle[] = [
  {
    slug: "best-time-to-visit-zanzibar",
    title: "Best time to visit Zanzibar",
    excerpt: "Seasons, tides, and when each tour shines — a quick planner for your dates.",
    coverSeed: "journal-season",
    category: "Planning",
    date: "2026-01-15",
    readingMinutes: 4,
    author: "Local guide",
    draft: true,
    content:
      "Placeholder for a real article. Replace this string with a useful guide: dry vs green season, tide calendars for Safari Blue, spice harvest windows, and how to pick Stone Town vs beach mornings. Keep it factual and short.",
  },
  {
    slug: "what-to-pack-spice-farm",
    title: "What to pack for a spice farm",
    excerpt: "Shoes, sun, and the small things a guide notices.",
    coverSeed: "journal-pack",
    category: "Tips",
    date: "2026-01-10",
    readingMinutes: 3,
    author: "Local guide",
    draft: true,
    content:
      "Placeholder. Replace with a practical packing list: closed shoes vs sandals, water, scarf, allergy notes, and why morning is the sweetest time on the farm.",
  },
  {
    slug: "stone-town-half-day",
    title: "Stone Town in half a day",
    excerpt: "A slow walk — doors, bazaars, markets and rooftops without rushing.",
    coverSeed: "journal-stonetown",
    category: "Guides",
    date: "2026-01-05",
    readingMinutes: 5,
    author: "Local guide",
    draft: true,
    content:
      "Placeholder. Replace with a half-day Stone Town flow: where to start, quiet alleys, good coffee stops, and which landmark to save for golden hour.",
  },
];

export function getArticle(slug: string) {
  return journalArticles.find((a) => a.slug === slug);
}
