import type { MetadataRoute } from "next";
import { business } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || `https://${business.name.toLowerCase().replace(/\s+/g, "-")}.vercel.app`;
  const baseUrl = base.endsWith("/") ? base.slice(0, -1) : base;
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
