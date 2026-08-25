import { createClient } from "@/lib/supabase/server";

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_seed: string;
  category: string;
  reading_minutes: number;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

// Public: published posts only
export async function getPublishedPosts(): Promise<JournalPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("journal_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    return (data as JournalPost[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("journal_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return (data as JournalPost) ?? null;
  } catch {
    return null;
  }
}

// Admin: everything incl. drafts
export async function getAllPosts(): Promise<JournalPost[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("journal_posts").select("*").order("created_at", { ascending: false });
  return (data as JournalPost[]) ?? [];
}
