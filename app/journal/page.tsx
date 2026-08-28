import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { business } from "@/lib/constants";
import { journalArticles } from "@/lib/journal";
import { getPublishedPosts, type JournalPost } from "@/lib/journal-db";
import { placeholderPhoto } from "@/lib/placeholder";
import { getLang, tServer } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: `Journal — ${business.name}`,
  description: "Practical Zanzibar notes — when to go, what to pack, and how to walk Stone Town slowly.",
};

export const dynamic = "force-dynamic";

type Card = { slug: string; title: string; excerpt: string; coverSeed: string; category: string; readingMinutes: number };

function toCards(posts: JournalPost[]): Card[] {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverSeed: p.cover_seed,
    category: p.category,
    readingMinutes: p.reading_minutes,
  }));
}

export default async function JournalPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);

  // CMS first; fall back to static slots while the table is empty
  const dbPosts = await getPublishedPosts();
  const cards: Card[] = dbPosts.length > 0
    ? toCards(dbPosts)
    : journalArticles.map((a) => ({
        slug: a.slug, title: a.title, excerpt: a.excerpt, coverSeed: a.coverSeed, category: a.category, readingMinutes: a.readingMinutes,
      }));

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("journalKicker")}</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">{t("journalTitle")}</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">
        {t("shortUsefulReads")}
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-5 md:gap-6">
        {cards.map((a) => (
          <Link
            key={a.slug}
            href={`/journal/${a.slug}`}
            className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-emphasis"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <Image src={placeholderPhoto(a.coverSeed, 800, 500)} alt={a.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-stone-500 flex items-center gap-2">
                {a.category} <span className="h-1 w-1 rounded-full bg-stone-300" /> <Clock size={12} /> {a.readingMinutes} {t("minRead")}
              </p>
              <h2 className="font-display font-semibold mt-1 text-stone-900 group-hover:text-clove-700 transition-colors">{a.title}</h2>
              <p className="text-sm text-stone-600 leading-relaxed mt-1.5 line-clamp-2">{a.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-clove-700 mt-3 group-hover:gap-1.5 transition-all">
                {t("read")} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
