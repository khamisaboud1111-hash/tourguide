import { business } from "@/lib/constants";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: business.name,
    description: business.guideBioShort,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Stone Town",
      addressRegion: "Zanzibar",
      addressCountry: "TZ",
    },
    telephone: business.phoneDisplay,
    email: business.email,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    areaServed: "Zanzibar",
    sameAs: [business.facebook, business.instagram, business.tiktok].filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function TourJsonLd({
  tour,
}: {
  tour: { title: string; summary: string; priceUsd: number; slug: string };
  rating?: { average: number; count: number } | null;
}) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url: `${base}/tours/${tour.slug}`,
    touristType: ["Couples", "Families", "Solo travelers", "Small groups"],
    provider: { "@type": "TravelAgency", name: business.name },
    // offers hidden until admin sets price via TourForm — re-add when price should be public:
    // offers: { "@type": "Offer", price: tour.priceUsd, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${base}/tours/${tour.slug}` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.url}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
