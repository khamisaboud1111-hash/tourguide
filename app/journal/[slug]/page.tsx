import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { business } from "@/lib/constants";
import { getArticle, journalArticles } from "@/lib/journal";
import { placeholderPhoto } from "@/lib/placeholder";

export async function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: `${a.title} — ${business.name} Journal`,
    description: a.excerpt,
    openGraph: { title: `${a.title} — ${business.name}`, description: a.excerpt, type: "article" },
  };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const date = new Date(a.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="container-page py-8 md:py-12 max-w-3xl">
      <Link href="/journal" className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-clove-600 transition-colors">
        <ArrowLeft size={14} /> Back to journal
      </Link>

      <p className="mt-6 text-clove-700 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2">
        {a.category} <span className="h-1 w-1 rounded-full bg-stone-300" /> {a.readingMinutes} min read
      </p>
      <h1 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">{a.title}</h1>
      <p className="mt-3 text-stone-600 leading-relaxed">{a.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5"><User size={12} /> {a.author}</span>
        <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {date}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {a.readingMinutes} min</span>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-6 bg-stone-100">
        <Image src={placeholderPhoto(a.coverSeed, 1200, 700)} alt={a.title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="prose max-w-none mt-8 text-stone-700 leading-relaxed">
        <p>{a.content}</p>
      </div>

      {/* Article structured data — truthful, no fake dates beyond placeholder */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            author: { "@type": "Person", name: a.author },
            datePublished: a.date,
            publisher: { "@type": "Organization", name: business.name },
          }),
        }}
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft">
          Explore experiences
        </Link>
        <Link href="/journal" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
          More notes
        </Link>
      </div>
    </article>
  );
}
