import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { business } from "@/lib/constants";
import { journalArticles } from "@/lib/journal";
import { placeholderPhoto } from "@/lib/placeholder";

export const metadata: Metadata = {
  title: `Journal — ${business.name}`,
  description: "Practical Zanzibar notes — when to go, what to pack, and how to walk Stone Town slowly.",
};

export default function JournalPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">Zanzibar journal</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">Travel notes & guides</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">
        Short, useful reads for planning — no fluff. Articles are marked “Coming soon” until your guide replaces the placeholders with real writing. This keeps the structure SEO-ready without faking content.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-5 md:gap-6">
        {journalArticles.map((a) => (
          <Link
            key={a.slug}
            href={`/journal/${a.slug}`}
            className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-emphasis"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <Image src={placeholderPhoto(a.coverSeed, 800, 500)} alt={a.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              {a.draft && (
                <span className="absolute top-3 left-3 rounded-full bg-saffron-500 text-white px-3 py-1 text-xs font-medium shadow-soft">Coming soon</span>
              )}
            </div>
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-stone-500 flex items-center gap-2">
                {a.category} <span className="h-1 w-1 rounded-full bg-stone-300" /> <Clock size={12} /> {a.readingMinutes} min
              </p>
              <h2 className="font-display font-semibold mt-1 text-stone-900 group-hover:text-clove-700 transition-colors">{a.title}</h2>
              <p className="text-sm text-stone-600 leading-relaxed mt-1.5 line-clamp-2">{a.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-clove-700 mt-3 group-hover:gap-1.5 transition-all">
                Read <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-stone-100 border border-stone-200 p-6 text-sm text-stone-600">
        <p className="font-medium text-stone-800">For the owner</p>
        <p className="mt-1">Edit <code className="bg-white border border-stone-200 px-1.5 py-0.5 rounded text-xs">lib/journal.ts</code> to publish. Replace the three draft slots — or add more — and they appear instantly. No database migration needed for v1.</p>
      </div>
    </div>
  );
}
