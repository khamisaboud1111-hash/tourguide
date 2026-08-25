"use client";

import { useState, useTransition } from "react";
import { Save, Trash2 } from "lucide-react";
import { savePost, deletePost } from "@/app/actions/journal";
import type { JournalPost } from "@/lib/journal-db";

const input = "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15";
const label = "block text-sm font-medium text-stone-700 mb-1.5";

export default function JournalEditor({ post }: { post?: JournalPost }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    if (post?.id) fd.set("id", post.id);
    startTransition(async () => {
      const res = await savePost(fd);
      if (res.ok) setSaved(true);
      else setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="title">Title</label>
          <input id="title" name="title" required defaultValue={post?.title} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="slug">Slug <span className="text-stone-400 font-normal">(the URL part)</span></label>
          <input id="slug" name="slug" required defaultValue={post?.slug} placeholder="best-time-to-visit-zanzibar" className={input} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="excerpt">Excerpt <span className="text-stone-400 font-normal">(shown on cards)</span></label>
        <textarea id="excerpt" name="excerpt" required rows={2} defaultValue={post?.excerpt} className={input} />
      </div>

      <div>
        <label className={label} htmlFor="content">Article <span className="text-stone-400 font-normal">(plain text, blank line = new paragraph)</span></label>
        <textarea id="content" name="content" required rows={12} defaultValue={post?.content} className={`${input} font-mono text-[13px]`} />
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div>
          <label className={label} htmlFor="coverSeed">Cover image</label>
          <input id="coverSeed" name="coverSeed" required defaultValue={post?.cover_seed ?? "journal-season"} className={input} />
          <p className="mt-1 text-xs text-stone-500">e.g. journal-season, stonetown-1, sitmeir_real_08</p>
        </div>
        <div>
          <label className={label} htmlFor="category">Category</label>
          <input id="category" name="category" required defaultValue={post?.category ?? "Guides"} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="readingMinutes">Read (min)</label>
          <input id="readingMinutes" name="readingMinutes" type="number" min="1" max="60" defaultValue={post?.reading_minutes ?? 4} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="author">Author</label>
          <input id="author" name="author" defaultValue={post?.author ?? "Abdul Hamid"} className={input} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="rounded border-stone-300" />
        Published (visible on the journal)
      </label>

      {error && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{error}</p>}
      {saved && <p className="rounded-lg bg-lagoon-50 text-lagoon-700 text-sm px-3 py-2">Saved.</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
          <Save size={15} /> {isPending ? "Saving…" : "Save post"}
        </button>
      </div>
    </form>
  );
}

export function DeletePostButton({ id, slug }: { id: string; slug: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
        startTransition(async () => { await deletePost(id); });
      }}
      className="inline-flex items-center gap-1 rounded-full border border-clove-200 text-clove-700 px-3 py-1.5 text-xs font-medium hover:bg-clove-50 disabled:opacity-60 transition-colors"
    >
      <Trash2 size={13} /> Delete
    </button>
  );
}
