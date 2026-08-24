export type Tour = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  groupSize: string;
  difficulty: "Easy" | "Moderate" | "Active";
  priceUsd: number;
  summary: string;
  description: string;
  includes: string[];
  excludes: string[];
  meetingPoint: string;
  coords: { lat: number; lng: number };
  photoSeed: string;
  highlights?: { title: string; body: string }[];
  itinerary?: string[];
  whatToBring?: string[];
  cancellationPolicy?: string;
  isFeatured?: boolean;
};

// Supabase rows come back snake_case — this is the one place that
// translates a database row into the shape every component expects.
export function rowToTour(row: {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  group_size: string;
  difficulty: string;
  price_usd: number;
  summary: string;
  description: string;
  includes: string[];
  excludes: string[];
  meeting_point: string;
  lat: number;
  lng: number;
  photo_seed: string;
  highlights?: { title: string; body: string }[] | null;
  itinerary?: string[] | null;
  what_to_bring?: string[] | null;
  cancellation_policy?: string | null;
  is_featured?: boolean | null;
}): Tour {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    duration: row.duration,
    groupSize: row.group_size,
    difficulty: row.difficulty as Tour["difficulty"],
    priceUsd: row.price_usd,
    summary: row.summary,
    description: row.description,
    includes: row.includes,
    excludes: row.excludes,
    meetingPoint: row.meeting_point,
    coords: { lat: row.lat, lng: row.lng },
    photoSeed: row.photo_seed,
    highlights: (row.highlights as Tour["highlights"]) ?? undefined,
    itinerary: row.itinerary ?? undefined,
    whatToBring: row.what_to_bring ?? undefined,
    cancellationPolicy: row.cancellation_policy ?? undefined,
    isFeatured: row.is_featured ?? undefined,
  };
}
