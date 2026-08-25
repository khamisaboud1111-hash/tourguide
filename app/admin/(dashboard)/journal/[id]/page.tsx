import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/journal-db";
import JournalEditor from "@/components/admin/JournalEditor";

export const dynamic = "force-dynamic";

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Edit post</h1>
      <JournalEditor post={post} />
    </div>
  );
}
