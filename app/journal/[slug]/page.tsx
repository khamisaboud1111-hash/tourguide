import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { business } from "@/lib/constants";
import { getPostBySlug } from "@/lib/journal-db";
import { journalArticles } from "@/lib/journal";
import { placeholderPhoto } from "@/lib/placeholder";
import { getLang, tServer } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // CMS first, static fallback
  const post = await getPostBySlug(slug);
  if (post) {
    return {
      title: `${post.title} — ${business.name} Journal`,
      description: post.excerpt,
      openGraph: { title: `${post.title} — ${business.name}`, description: post.excerpt, type: "article" },
    };
  }
  const a = journalArticles.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `${a.title} — ${business.name} Journal`,
    description: a.excerpt,
    openGraph: { title: `${a.title} — ${business.name}`, description: a.excerpt, type: "article" },
  };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);

  // CMS first, static fallback (keeps the 3 seeded slots working pre-migration)
  const post = await getPostBySlug(slug);
  const staticArticle = journalArticles.find((x) => x.slug === slug);
  if (!post && !staticArticle) notFound();

  const title = post?.title ?? staticArticle!.title;
  const excerpt = post?.excerpt ?? staticArticle!.excerpt;
  const content = post?.content ?? staticArticle!.content;
  const coverSeed = post?.cover_seed ?? staticArticle!.coverSeed;
  const category = post?.category ?? staticArticle!.category;
  const readingMinutes = post?.reading_minutes ?? staticArticle!.readingMinutes;
  const author = post?.author ?? staticArticle!.author;
  const dateISO = post?.published_at ?? post?.created_at ?? staticArticle!.date;

  const date = new Date(dateISO).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="container-page py-8 md:py-12 max-w-3xl">
      <Link href="/journal" className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-clove-600 transition-colors">
        <ArrowLeft size={14} /> {t("backToJournal")}
      </Link>

      <p className="mt-6 text-clove-700 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2">
        {category} <span className="h-1 w-1 rounded-full bg-stone-300" /> {readingMinutes} {t("minRead")}
      </p>
      <h1 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">{title}</h1>
      <p className="mt-3 text-stone-600 leading-relaxed">{excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5"><User size={12} /> {author}</span>
        <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {date}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {readingMinutes} {t("minRead")}</span>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-6 bg-stone-100">
        <Image src={placeholderPhoto(coverSeed, 1200, 700)} alt={title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="mt-8 space-y-4 text-stone-700 leading-relaxed">
        {content.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: excerpt,
            author: { "@type": "Person", name: author },
            datePublished: dateISO,
            publisher: { "@type": "Organization", name: business.name },
          }),
        }}
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft">
          {t("explore")}
        </Link>
        <Link href="/journal" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
          {t("moreNotes")}
        </Link>
      </div>
    </article>
  );
}
