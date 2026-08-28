import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Gauge, Check, X, MessageCircle, ArrowLeft, MapPin, ShieldCheck, ChevronRight, Star } from "lucide-react";
import { rowToTour } from "@/lib/tours";
import { placeholderPhoto } from "@/lib/placeholder";
import { business, waLink } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import TourMapLoader from "@/components/TourMapLoader";
import BookingForm from "@/components/BookingForm";
import ImageGallery from "@/components/ImageGallery";
import StickyBookingBar from "@/components/StickyBookingBar";
import TourCard from "@/components/TourCard";
import { getLang, tServer } from "@/lib/i18n/server";
import { getPublishedReviews, aggregateRating } from "@/lib/reviews";
import { TourJsonLd, BreadcrumbJsonLd } from "@/components/StructuredData";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("*").eq("slug", slug).single();
  if (!data) return {};
  const tour = rowToTour(data);
  return {
    title: `${tour.title} — ${business.name}`,
    description: tour.summary,
    openGraph: { title: `${tour.title} — ${business.name}`, description: tour.summary },
  };
}

// Minimal highlight/itinerary fallbacks — no fake content, just generic structure that the owner can replace per-tour via DB later.
function highlightsFor(tour: ReturnType<typeof rowToTour>) {
  const map: Record<string, { title: string; body: string }[]> = {
    "stone-town-walking-tour": [
      { title: "Walk the coral-stone alleys", body: "Carved doors, bazaars, and the layered history of Swahili, Omani and Indian Zanzibar." },
      { title: "House of Wonders & Slave Market memorial", body: "Context and quiet — where the island's past is remembered properly." },
      { title: "Rooftop viewpoint", body: "Stone Town's flat roofs and the sea beyond — best light before noon." },
    ],
    "spice-farm-tour": [
      { title: "Taste the Spice Island", body: "Clove, vanilla, cinnamon, nutmeg — seen, smelled and tasted live on the farm." },
      { title: "Walk with the farmer", body: "How each crop is grown and why Zanzibar once led the world in clove." },
      { title: "Fruit tasting", body: "Fresh harvest to finish — seasonal and generous." },
    ],
    "safari-blue": [
      { title: "Dhow sailing in Menai Bay", body: "Traditional wooden dhow, calm water, and sandbanks at low tide." },
      { title: "Snorkeling the reef", body: "Clear, protected water — gear included." },
      { title: "Seafood lunch on the beach", body: "Grilled fish, fruit — eaten with your feet in the sand." },
    ],
    "jozani-forest-tour": [
      { title: "Red colobus monkeys", body: "Endemic to Zanzibar — quiet troops, close but wild." },
      { title: "Mangrove boardwalk", body: "A suspended walk over the estuary — birds, crabs, quiet." },
      { title: "National park forest", body: "Zanzibar's only national park — a short, easy walk." },
    ],
  };
  return map[tour.slug] ?? [
    { title: "Local guiding", body: "Led in person, paced for questions and wandering." },
    { title: "Small group", body: "No buses — you see more when the group stays small." },
    { title: "Real island day", body: "Timing that matches tide, light and season." },
  ];
}

function itineraryFor(tour: ReturnType<typeof rowToTour>) {
  if (tour.slug === "stone-town-walking-tour") return ["09:00 Meet at Forodhani Gardens", "09:20 Coral-stone alleys & doors", "10:00 Bazaar & House of Wonders", "10:45 Memorial & viewpoints", "12:00 Tea break, tour ends"];
  if (tour.slug === "safari-blue") return ["08:30 Fumba jetty & dhow boarding", "09:30 Sail to sandbank, swim", "11:00 Snorkel the reef", "13:00 Seafood lunch on the beach", "15:30 Sail back"];
  if (tour.slug === "jozani-forest-tour") return ["09:00 Jozani visitor centre", "09:20 Forest walk — colobus troops", "10:30 Mangrove boardwalk", "11:15 Depart or optional extension"];
  // generic
  return [`Start — ${tour.meetingPoint}`, "Main experience — unhurried, guide-led", "Local stops chosen for the day", "Return — same meeting point unless arranged otherwise"];
}

const faq = [
  { q: "Is hotel pickup included?", a: "Depends on the tour — see 'Not included' for each. Pickup can usually be arranged for a small fee; ask on WhatsApp with your hotel name." },
  { q: "What should I bring?", a: "Comfortable shoes, sun protection, water, camera. The tour page lists specifics per experience." },
  { q: "Do I pay now?", a: "No — your request is a booking inquiry. The guide confirms availability, then you can pay a small deposit online or the full on the day." },
];

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("*").eq("slug", slug).single();
  if (!data) notFound();
  const tour = rowToTour(data);

  const { data: relatedRows } = await supabase.from("tours").select("*").eq("is_published", true).neq("slug", slug).limit(3);
  const related = (relatedRows ?? []).map(rowToTour);

  const bookingMessage = `Hi ${business.guideName}, I'd like to book the ${tour.title} tour.`;
  const deposit = Math.max(1, Math.round(tour.priceUsd * business.depositPercent));
  const remaining = tour.priceUsd - deposit;

  // Build gallery — seed + 3 variants using same seed family so placeholders stay coherent
  const gallery = [
    { src: placeholderPhoto(tour.photoSeed, 1600, 1000), alt: `${tour.title} — main view` },
    { src: placeholderPhoto(`${tour.photoSeed}-2`, 800, 600), alt: `${tour.title} — detail` },
    { src: placeholderPhoto(`${tour.photoSeed}-3`, 800, 600), alt: `${tour.title} — local scene` },
    { src: placeholderPhoto(`${tour.photoSeed}-4`, 800, 600), alt: `${tour.title} — another view` },
  ];

  const highlights = tour.highlights && tour.highlights.length > 0 ? tour.highlights : highlightsFor(tour);
  const itinerary = tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : itineraryFor(tour);
  const whatToBringList = tour.whatToBring && tour.whatToBring.length > 0 ? tour.whatToBring : ["Comfortable shoes", "Sunscreen, water, camera", "Light scarf for Stone Town"];
  const cancellationText = tour.cancellationPolicy || t("cancellationDesc");

  // Real reviews only — aggregate shown only when genuine reviews exist
  const reviews = await getPublishedReviews(tour.id);
  const rating = aggregateRating(reviews);

  return (
    <div className="pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="container-page pt-6 md:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-stone-500">
          <Link href="/tours" className="inline-flex items-center gap-1 hover:text-clove-600 transition-colors">
            <ArrowLeft size={14} /> {t("allTours")}
          </Link>
          <ChevronRight size={14} className="opacity-40" />
          <span className="text-stone-700 truncate">{tour.title}</span>
        </nav>
      </div>

      {/* Title row */}
      <div className="container-page mt-4">
        <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium">{tour.category}</p>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-stone-900 mt-2 text-balance">{tour.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-clove-600" />{tour.meetingPoint}</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-stone-300" />
          <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {tour.duration}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} /> {tour.groupSize}</span>
          <span className="inline-flex items-center gap-1.5"><Gauge size={14} /> {tour.difficulty}</span>
          {rating && (
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="text-saffron-500 fill-saffron-500" />
              <span className="font-medium text-stone-900">{rating.average}</span> ({rating.count} {rating.count === 1 ? t("review") : t("reviews")})
            </span>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="container-page mt-6">
        <ImageGallery photos={gallery} title={tour.title} />
      </div>

      <div className="container-page py-8 md:py-12 grid md:grid-cols-3 gap-8 md:gap-12">
        {/* Left — editorial */}
        <div className="md:col-span-2 space-y-10">
          {/* Quick facts */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("duration"), value: tour.duration },
              { label: t("group"), value: tour.groupSize },
              { label: t("level"), value: tour.difficulty },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-stone-50 border border-stone-200 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.08em] text-stone-500">{f.label}</p>
                <p className="font-display font-semibold text-stone-900 mt-1 text-sm">{f.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold">{t("aboutThis")}</h2>
            <p className="mt-3 text-stone-700 leading-relaxed text-[15px]">{tour.description}</p>
            <p className="mt-3 text-stone-600 text-sm leading-relaxed">{tour.summary}</p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">{t("highlights")}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {highlights.map((h) => (
                <div key={h.title} className="rounded-2xl bg-white border border-stone-200 p-5 shadow-soft">
                  <Star size={16} className="text-saffron-500" />
                  <h4 className="font-display font-semibold mt-2 text-stone-900">{h.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">{h.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">{t("itinerary")}</h3>
            <ol className="relative border-l border-stone-200 pl-6 space-y-4">
              {itinerary.map((step) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-clove-600 border-2 border-white shadow" />
                  <p className="text-sm text-stone-700">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-stone-500">{t("timesFlexible")}</p>
          </div>

          {/* Included / Excluded */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-2xl bg-lagoon-50 border border-lagoon-200 p-5">
              <h3 className="font-display text-base font-semibold text-lagoon-900">{t("included")}</h3>
              <ul className="mt-3 space-y-2">
                {tour.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <Check size={16} className="text-lagoon-600 mt-0.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5">
              <h3 className="font-display text-base font-semibold">{t("notIncluded")}</h3>
              <ul className="mt-3 space-y-2">
                {tour.excludes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <X size={16} className="text-clove-500 mt-0.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What to bring + Meeting */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <h3 className="font-display text-base font-semibold mb-2">{t("whatToBring")}</h3>
              <ul className="mt-2 space-y-1.5">
                {whatToBringList.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-stone-600"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-clove-600 shrink-0" />{w}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <h3 className="font-display text-base font-semibold mb-2 flex items-center gap-2"><MapPin size={16} className="text-clove-600" /> {t("meetingPoint")}</h3>
              <p className="text-sm text-stone-700">{tour.meetingPoint}</p>
              <p className="text-xs text-stone-500 mt-1">{tour.coords.lat.toFixed(4)}, {tour.coords.lng.toFixed(4)} {t("copyIntoMaps")}</p>
              <div className="mt-3 h-48 rounded-xl overflow-hidden border border-stone-200">
                <TourMapLoader lat={tour.coords.lat} lng={tour.coords.lng} label={tour.meetingPoint} />
              </div>
            </div>
          </div>

          {/* Cancellation */}
          <div className="rounded-2xl bg-stone-100 border border-stone-200 p-5">
            <h3 className="font-display text-base font-semibold flex items-center gap-2"><ShieldCheck size={16} className="text-lagoon-700" /> {t("cancellation")}</h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">{cancellationText}</p>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-3">{t("goodToKnow")}</h3>
            <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white overflow-hidden">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-stone-900">
                    {f.q} <ChevronRight size={16} className="text-stone-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Reviews — real, moderated only */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-3">
              {t("whatGuestsSay")}{rating ? ` — ${rating.average}/5 · ${rating.count}` : ""}
            </h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-stone-500 rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-5">
                {t("noReviewsYet")}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <figure key={r.id} className="rounded-2xl bg-white border border-stone-200 p-5 shadow-soft">
                    <div className="text-saffron-500 text-sm" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}<span className="text-stone-300">{"★".repeat(5 - r.rating)}</span></div>
                    <blockquote className="mt-2 text-sm text-stone-700 leading-relaxed">“{r.review}”</blockquote>
                    <figcaption className="mt-3 text-xs text-stone-500">
                      <span className="font-medium text-stone-700">{r.customer_name}</span>
                      {r.country ? ` · ${r.country}` : ""} · {new Date(r.created_at).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { month: "short", year: "numeric" })}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-4">{t("youMayLike")}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <TourCard key={r.slug} tour={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — booking card */}
        <aside className="md:col-span-1" id="booking">
          <div className="sticky top-[88px] rounded-2xl border border-stone-200 bg-white shadow-card p-6 space-y-5">
            <div>
              <p className="font-display text-3xl font-semibold text-stone-900">${tour.priceUsd} <span className="text-sm font-body font-normal text-stone-500">{t("perPerson")}</span></p>
              <p className="text-xs text-stone-500 mt-1">{t("deposit")} ${deposit} · {t("remaining")} ${remaining} {t("onTheDay")} · {business.depositPercent * 100}% online</p>
            </div>

            <BookingForm tourId={tour.id} tourTitle={tour.title} priceUsd={tour.priceUsd} />

            <div className="relative text-center">
              <span className="relative bg-white px-3 text-xs text-stone-400 uppercase tracking-wide">{t("tor")}</span>
              <div className="absolute top-1/2 left-0 right-0 border-t border-stone-200 -z-10" />
            </div>

            <a
              href={waLink(bookingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-lagoon-300 text-lagoon-800 hover:bg-lagoon-50 transition-colors px-6 py-3 font-medium text-sm"
            >
              <MessageCircle size={18} /> {t("askAboutThisTour")}
            </a>
            <p className="text-xs text-stone-500 text-center">
              {t("noPaymentNow").replace(/\{name\}/, business.guideName)}
            </p>
          </div>
        </aside>
      </div>

      <StickyBookingBar price={tour.priceUsd} title={tour.title} slug={tour.slug} />
    </div>
  );
}
