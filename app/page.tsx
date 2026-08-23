import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Compass, MessageCircle, Star, MapPin, Clock, Waves } from "lucide-react";
import TourCard from "@/components/TourCard";
import TestimonialCard, { type Testimonial } from "@/components/TestimonialCard";
import DoorMotifDivider from "@/components/DoorMotifDivider";
import SectionHeading from "@/components/ui/SectionHeading";
import { business, waLink } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { rowToTour } from "@/lib/tours";
import { placeholderPhoto } from "@/lib/placeholder";

export const dynamic = "force-dynamic";

const values = [
  {
    icon: ShieldCheck,
    title: "Licensed & local",
    body: "Every tour is led personally — licensed in Zanzibar, rooted in Stone Town. You get the stories a textbook can't tell you.",
  },
  {
    icon: Users,
    title: "Small groups, private options",
    body: "No buses. Typically 1–8 guests so you can actually ask questions, linger, and adjust pace on the day.",
  },
  {
    icon: Compass,
    title: "Real routes, not scripts",
    body: "Stops are chosen for what's worth seeing today — a calm reef, a quiet alley, a farm at the right hour.",
  },
];

const whyLocal = [
  { k: "01", title: "Local knowledge", desc: "Alleys, farms, reefs — known by season and hour, not by brochure." },
  { k: "02", title: "Personal attention", desc: "Your guide walks with you, not ahead of a crowd. Questions welcome." },
  { k: "03", title: "Authentic experiences", desc: "Culture, food, and people — respectfully, unhurriedly." },
  { k: "04", title: "Local connection", desc: "Direct WhatsApp, flexible timing, real recommendations for after the tour." },
];

const destinations = [
  { name: "Stone Town", blurb: "Coral-stone alleys, carved doors, bazaars", seed: "stonetown-door" },
  { name: "Spice Farms", blurb: "Clove, vanilla, cinnamon — tasted live", seed: "spice-farm" },
  { name: "Jozani Forest", blurb: "Red colobus monkeys, mangrove boardwalk", seed: "jozani-forest" },
  { name: "South Coast", blurb: "Menai Bay, sandbanks & dhow sailing", seed: "safariblue" },
];

const testimonials: Testimonial[] = [
  {
    quote: "Our guide knew every alley in Stone Town by name and had a story for half of them. Best three hours of the whole trip.",
    name: "Freja",
    origin: "Denmark",
    tour: "Stone Town Walking Tour",
  },
  {
    quote: "Safari Blue was the highlight of our honeymoon. The sandbank at low tide looked unreal, and lunch on the beach was fantastic.",
    name: "Marcus & Lee",
    origin: "Singapore",
    tour: "Safari Blue Sailing Tour",
  },
  {
    quote: "Seeing the red colobus monkeys up close at Jozani was worth the trip alone. Relaxed pace, never felt rushed.",
    name: "Amara",
    origin: "Nigeria",
    tour: "Jozani Forest Tour",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  const tours = (data ?? []).map(rowToTour);
  const [featured, ...rest] = tours;
  const signature = tours.slice(0, 6);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[580px] w-full overflow-hidden -mt-[72px] pt-[72px]">
        <Image
          src={placeholderPhoto("hero-dhow-sunset", 1920, 1200)}
          alt="Traditional dhow sailing off Zanzibar at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* soft cinematic overlay — restrained, not heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/88 via-indigo-900/30 to-indigo-900/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent hidden md:block" />

        <div className="relative h-full container-page flex flex-col justify-end pb-10 md:pb-14">
          <p className="font-body text-saffron-300 tracking-[0.2em] text-[11px] md:text-xs uppercase mb-3 md:mb-4">
            Karibu — welcome · Stone Town, Zanzibar
          </p>
          <h1 className="font-display italic font-medium text-[2.6rem] leading-[0.95] md:text-6xl lg:text-[4.75rem] text-stone-50 max-w-3xl text-balance">
            See Zanzibar<br />
            <span className="not-italic font-semibold">the way locals do</span>
          </h1>
          <p className="mt-4 md:mt-5 max-w-xl text-stone-200 text-[15px] md:text-lg leading-relaxed">
            {business.guideBioShort} Small groups, flexible days, and routes that change with the sea and the season.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 active:bg-clove-800 transition-colors text-stone-50 px-6 md:px-7 py-3.5 font-medium shadow-floating"
            >
              Explore experiences <ArrowRight size={18} />
            </Link>
            <a
              href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 hover:bg-white transition-colors px-6 md:px-7 py-3.5 font-medium shadow-card"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          {/* Trust signals — factual only, no invented ratings */}
          <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white"><ShieldCheck size={14} /></span>
              Licensed local guide
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
              <Users size={14} className="text-saffron-300" /> Small groups · Private available
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
              <Star size={14} className="text-saffron-300 fill-saffron-300" /> Direct contact, no third party
            </span>
          </div>

          {/* subtle scroll indicator */}
          <div className="hidden md:flex mt-8 items-center gap-2 text-stone-300/70 text-xs tracking-wide">
            <span className="h-8 w-px bg-stone-50/25" />
            Scroll to discover
          </div>
        </div>
      </section>

      {/* Discovery bar — integrated into hero flow */}
      <section className="container-page -mt-6 md:-mt-8 relative z-10">
        <div className="rounded-2xl bg-white border border-stone-200 shadow-card p-4 md:p-5 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <MapPin size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">Where</span>
                Stone Town · Spice Farms · Jozani
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <Clock size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">When</span>
                Any date — flexible
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <Waves size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">Experience</span>
                Culture · Ocean · Nature
              </span>
            </label>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lagoon-700 text-stone-50 px-6 py-3.5 text-sm font-medium hover:bg-lagoon-800 transition-colors shrink-0 shadow-soft w-full md:w-auto"
          >
            Explore experiences <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-stone-500">
          Every tour adjusts for group size and timing — ask on WhatsApp for a custom plan.
        </p>
      </section>

      <DoorMotifDivider tone="onLight" className="mt-6" />

      {/* ── Why travel with a local — editorial ─────────────────── */}
      <section className="container-page py-12 md:py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
          <div className="md:col-span-5">
            <SectionHeading
              kicker="Why travel with a local"
              title="Not a scripted route — a real island day"
              description="Stone Town isn't a museum. The tide moves, farms ripen, markets shift — we walk where today makes sense, not where every bus goes."
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {whyLocal.map((w) => (
                <div key={w.k} className="rounded-2xl bg-stone-100 border border-stone-200 p-4">
                  <p className="text-saffron-600 text-xs font-medium tracking-widest">{w.k}</p>
                  <h4 className="font-display font-semibold text-stone-900 mt-1">{w.title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed mt-1.5">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-3 md:gap-4">
            <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("stonetown-alley", 800, 600)} alt="Stone Town alley with carved doors" fill className="object-cover" sizes="(min-width:768px) 40vw, 65vw" />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("spice-tasting", 600, 800)} alt="Spice tasting on a Zanzibar farm" fill className="object-cover" sizes="(min-width:768px) 20vw, 30vw" />
            </div>
            <div className="col-span-3 relative aspect-[16/7] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("ocean-sandbank", 1200, 500)} alt="White sandbank and turquoise water off Zanzibar" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
              <p className="absolute bottom-3 left-4 text-stone-50 text-xs md:text-sm font-medium">Menai Bay · reached by dhow</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signature experiences ─────────────────────────────── */}
      <section className="container-page py-6 md:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading kicker="Signature experiences" title="Ways to see the island" description="Six essentials — culture, ocean, nature. Every one can be private or small-group." />
          <Link href="/tours" className="hidden md:inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm hover:gap-2.5 transition-all shrink-0">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {signature.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500">
            No experiences published yet — add them in <Link href="/admin" className="text-clove-600 underline">/admin</Link>.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {signature[0] && <TourCard tour={signature[0]} featured />}
            {signature.slice(1, 6).map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        )}
        <div className="md:hidden mt-6 text-center">
          <Link href="/tours" className="inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm">View all tours <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ── Explore the island — destinations ─────────────────── */}
      <section className="bg-stone-100 py-12 md:py-16">
        <div className="container-page">
          <SectionHeading kicker="Explore the island" title="From alleys to reefs" align="center" className="mb-8 md:mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {destinations.map((d) => (
              <Link key={d.name} href="/tours" className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900">
                <Image src={placeholderPhoto(d.seed, 600, 800)} alt={d.name} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-entrance" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/85 via-indigo-900/10 to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <h3 className="font-display text-white text-xl font-semibold">{d.name}</h3>
                  <p className="text-stone-200 text-sm mt-1">{d.blurb}</p>
                  <span className="inline-flex items-center gap-1 text-saffron-300 text-xs font-medium mt-3">Explore <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured tour — large spotlight ───────────────────── */}
      {featured && (
        <section className="container-page py-12 md:py-16">
          <p className="text-saffron-600 text-xs uppercase tracking-[0.2em] font-medium mb-3">Featured</p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-soft">
            <div className="relative aspect-[4/3] md:aspect-[4/3] overflow-hidden m-2 rounded-xl">
              <Image src={placeholderPhoto(featured.photoSeed, 1000, 800)} alt={featured.title} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
            </div>
            <div className="p-6 md:p-8 md:pr-10">
              <p className="text-clove-600 text-xs uppercase tracking-[0.08em] font-medium">{featured.category}</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2 text-balance">{featured.title}</h3>
              <p className="text-stone-600 leading-relaxed mt-3">{featured.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1.5"><Clock size={14} /> {featured.duration}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1.5"><Users size={14} /> {featured.groupSize}</span>
                <span className="rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 font-display font-semibold">From ${featured.priceUsd} / person</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/tours/${featured.slug}`} className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft">
                  View experience <ArrowRight size={16} />
                </Link>
                <a href={waLink(`Hi ${business.guideName}, I'd like to book the ${featured.title} tour.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                  <MessageCircle size={16} /> Ask about this tour
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Meet your guide ───────────────────────────────────── */}
      <section className="container-page py-12 md:py-20">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          <div className="md:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
            <Image src={placeholderPhoto("guide-portrait", 800, 1000)} alt={business.guideName} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-3">
            <p className="text-saffron-600 text-xs uppercase tracking-[0.2em] font-medium mb-3">Your guide</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">{business.guideName}</h2>
            <p className="text-lagoon-700 font-medium text-sm mb-4">Licensed local guide · {business.location} · English & Swahili</p>
            <p className="text-stone-600 leading-relaxed max-w-xl">{business.guideBioShort} Prefer a flexible, human-paced day? That&apos;s the whole point — small groups, conversations, and the island on its own time.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className="inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm hover:gap-2.5 transition-all">Read the full story <ArrowRight size={16} /></Link>
              <a href={waLink(`Hi ${business.guideName}, I'd love to hear more about your tours.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium hover:border-lagoon-300 hover:text-lagoon-700 transition-colors">
                <MessageCircle size={16} /> Say hello
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guest stories ──────────────────────────────────────── */}
      <section className="bg-stone-100 py-12 md:py-20">
        <div className="container-page">
          <SectionHeading kicker="From past travelers" title="What guests say" align="center" className="mb-8 md:mb-12" />
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={i === 1 ? "md:mt-6" : ""}>
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-stone-500 max-w-2xl mx-auto">
            Real words from past guests on these tours. Verified indicator appears only where a booking can be matched — never invented.
          </p>
        </div>
      </section>

      {/* ── Journal teaser (content-ready, no fake articles) ────── */}
      <section className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading kicker="Zanzibar journal" title="Travel notes & guides" description="How to pack, when to sail, where to eat — short, useful reads for planning." />
          <Link href="/gallery" className="hidden md:inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm hover:gap-2.5 transition-all shrink-0">View gallery <ArrowRight size={16} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Best time to visit Zanzibar", excerpt: "Seasons, tides and when each tour shines.", seed: "journal-season" },
            { title: "What to pack for a spice farm", excerpt: "Shoes, sun and the small things guides notice.", seed: "journal-pack" },
            { title: "Stone Town in half a day", excerpt: "A slow walk — doors, markets, rooftops.", seed: "journal-stonetown" },
          ].map((a) => (
            <div key={a.title} className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-soft hover:shadow-card-hover transition-shadow">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={placeholderPhoto(a.seed, 800, 500)} alt={a.title} fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
              </div>
              <div className="p-5">
                <p className="text-saffron-600 text-[11px] uppercase tracking-[0.12em] font-medium">Coming soon</p>
                <h3 className="font-display font-semibold mt-1">{a.title}</h3>
                <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">{a.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Travel with confidence ─────────────────────────────── */}
      <section className="container-page py-10 md:py-14">
        <div className="rounded-2xl bg-lagoon-50 border border-lagoon-200 p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-semibold text-lagoon-900">Travel with confidence</h3>
            <p className="text-lagoon-700/80 text-sm leading-relaxed mt-2">Book small, pay small, confirm with a human. No surprise fees.</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3"><ShieldCheck size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">Flexible dates</span><br /><span className="text-stone-600">Free to adjust until confirmed.</span></p></div>
            <div className="flex gap-3"><Users size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">Small groups</span><br /><span className="text-stone-600">Private on request.</span></p></div>
            <div className="flex gap-3"><MapPin size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">Local pickup</span><br /><span className="text-stone-600">Meeting points + maps included.</span></p></div>
          </div>
        </div>
      </section>

      <DoorMotifDivider tone="onLight" />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="container-page py-12 md:py-16 text-center">
        <h2 className="font-display italic text-3xl md:text-5xl font-medium max-w-2xl mx-auto text-balance">Ready to see Zanzibar properly?</h2>
        <p className="mt-3 text-stone-600 max-w-xl mx-auto">Pick an experience or just say when you&apos;re in town — {business.guideName} will shape a day around you.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 active:bg-clove-800 transition-colors text-stone-50 px-7 py-3.5 font-medium shadow-soft">
            Explore tours <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-stone-300 hover:border-clove-300 hover:text-clove-700 transition-colors bg-white px-7 py-3.5 font-medium">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
