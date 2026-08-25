"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { authorizeStaff } from "@/lib/auth";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3, "Title is required").max(200),
  slug: z.string().min(2).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers, hyphens only"),
  excerpt: z.string().min(10, "Excerpt is required").max(300),
  content: z.string().min(20, "Content is required"),
  coverSeed: z.string().min(1, "Cover image is required"),
  category: z.string().min(2, "Category is required").max(60),
  readingMinutes: z.coerce.number().int().min(1).max(60),
  author: z.string().min(2).max(100),
  published: z.boolean(),
});

export type SavePostResult = { ok: true } | { ok: false; error: string };

export async function savePost(formData: FormData): Promise<SavePostResult> {
  await authorizeStaff("save journal post");

  const id = formData.get("id") as string | null;
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverSeed: formData.get("coverSeed"),
    category: formData.get("category"),
    readingMinutes: formData.get("readingMinutes") || 4,
    author: formData.get("author") || "Abdul Hamid",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const values = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    content: d.content,
    cover_seed: d.coverSeed,
    category: d.category,
    reading_minutes: d.readingMinutes,
    author: d.author,
    published: d.published,
    published_at: d.published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("journal_posts").update(values).eq("id", id)
    : await supabase.from("journal_posts").insert(values);

  if (error) {
    if (error.message.includes("duplicate")) return { ok: false, error: "That slug is already used — pick another." };
    return { ok: false, error: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/${d.slug}`);
  revalidatePath("/admin/journal");
  return { ok: true };
}

export async function deletePost(id: string) {
  await authorizeStaff("delete journal post");
  const supabase = await createClient();
  const { error } = await supabase.from("journal_posts").delete().eq("id", id);
  if (error) throw new Error(`Couldn't delete: ${error.message}`);
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
}
