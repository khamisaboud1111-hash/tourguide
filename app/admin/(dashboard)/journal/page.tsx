import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllPosts } from "@/lib/journal-db";
import { DeletePostButton } from "@/components/admin/JournalEditor";
import { getLang, tServer } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const posts = await getAllPosts();
  const lang = getLang();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{tServer("adminJournal", lang)}</h1>
        <Link
          href="/admin/journal/new"
          className="inline-flex items-center gap-2 rounded-full bg-lagoon-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-lagoon-800 transition-colors"
        >
          <Plus size={16} /> {tServer("adminNewPost", lang)}
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="text-sm text-stone-500">{tServer("adminNoPostsYet", lang)}</p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {posts.map((p) => (
          <div key={p.id} className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-stone-900 truncate">{p.title}</p>
              <p className="text-sm text-stone-500">
                {p.category} · {p.reading_minutes} min · {p.author}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2.5 py-1 rounded-full ${p.published ? "bg-lagoon-100 text-lagoon-800" : "bg-stone-200 text-stone-600"}`}>
                {p.published ? tServer("adminPublished", lang) : tServer("adminDraft", lang)}
              </span>
              <Link
                href={`/admin/journal/${p.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium hover:border-clove-300 hover:text-clove-700 transition-colors"
              >
                <Pencil size={13} /> {tServer("adminEdit", lang)}
              </Link>
              <DeletePostButton id={p.id} slug={p.slug} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
