import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/journal-db";
import JournalEditor from "@/components/admin/JournalEditor";
import { getLang, tServer } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getAllPosts()).find((p) => p.id === id);
  if (!post) notFound();
  const lang = getLang();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminEditPost", lang)}</h1>
      <JournalEditor post={post} />
    </div>
  );
}
