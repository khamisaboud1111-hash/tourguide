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
    makesOffer: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function TourJsonLd({ tour }: { tour: { title: string; summary: string; description: string; priceUsd: number; slug: string } }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour.title,
    description: tour.summary,
    url: `${base}/tours/${tour.slug}`,
    offers: {
      "@type": "Offer",
      price: tour.priceUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${base}/tours/${tour.slug}`,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
