import type { MetadataRoute } from "next";
import { business } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { journalArticles } from "@/lib/journal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || `https://${business.name.toLowerCase().replace(/\s+/g, "-")}.vercel.app`;
  const baseUrl = base.endsWith("/") ? base.slice(0, -1) : base;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/tours`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  // Tours — only published
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tours").select("slug, updated_at").eq("is_published", true);
    const tourRoutes: MetadataRoute.Sitemap = (data ?? []).map((t: { slug: string; updated_at: string }) => ({
      url: `${baseUrl}/tours/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    const journalRoutes: MetadataRoute.Sitemap = journalArticles
      .filter((a) => !a.draft)
      .map((a) => ({
        url: `${baseUrl}/journal/${a.slug}`,
        lastModified: new Date(a.date),
        changeFrequency: "monthly",
        priority: 0.5,
      }));
    return [...staticRoutes, ...tourRoutes, ...journalRoutes];
  } catch {
    return staticRoutes;
  }
}
