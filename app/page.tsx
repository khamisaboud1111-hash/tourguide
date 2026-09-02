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
import HillsBackdrop from "@/components/HillsBackdrop";
import HomePillNav from "@/components/HomePillNav";
import HeroCarousel from "@/components/HeroCarousel";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Primitives";
import { HeroIntro, HeroItem } from "@/components/motion/HeroIntro";
import { getLang, tServer } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

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
  const lang = getLang();
  const t = (k: string) => tServer(k, lang);
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("*").eq("is_published", true).order("created_at", { ascending: false });
  const tours = (data ?? []).map(rowToTour);
  const [featured] = tours;
  const signature = tours.slice(0, 6);

  // CMS — homepage settings from website_settings (admin can change hero/about)
  const { data: hpSettings } = await supabase.from("website_settings").select("key, value").eq("section", "homepage");
  const hpMap = new Map((hpSettings ?? []).map((r) => [r.key, r.value]));
  const hp = (k: string, fallback: string) => {
    const v = hpMap.get(k);
    if (v === undefined || v === null) return fallback;
    // value is jsonb — may be string like "See Zanzibar..." or JSON string
    return typeof v === "string" ? v : String(v);
  };

  const values = [
    { icon: ShieldCheck, title: t("licensedLocal"), body: lang === "sw" ? "Kila ziara inaongozwa moja kwa moja — leseni na maarifa ya Stone Town." : t("whyDesc") },
    { icon: Users, title: t("smallGroups"), body: t("smallGroupsDesc") },
    { icon: Compass, title: t("localKnowledge"), body: t("localKnowledgeDesc") },
  ];

  const whyLocal = [
    { k: "01", title: "Local Knowledge", desc: "Go beyond the guidebook.\n\nDiscover hidden streets, local markets, farms, beaches, reefs, and cultural gems that are best experienced with someone who knows when and where to find them." },
    { k: "02", title: "Personal Attention", desc: "Your experience, your pace.\n\nNo rushing from one stop to another. Ask questions, explore freely, take your time, and enjoy a tour shaped around you." },
    { k: "03", title: "Authentic Experiences", desc: "Meet the real Zanzibar.\n\nTaste local flavors, discover everyday island life, hear local stories, and experience Zanzibar's culture respectfully and naturally." },
    { k: "04", title: "Genuine Local Connection", desc: "A local connection that continues beyond the tour." },
  ];

  const destinations = [
    { name: "Stone Town", blurb: lang === "en" ? "Coral-stone alleys, carved doors, bazaars" : t("exploreIslandTitle"), seed: "stonetown-door" },
    { name: "Spice Farms", blurb: lang === "en" ? "Clove, vanilla, cinnamon — tasted live" : t("localKnowledge"), seed: "spice-farm" },
    { name: "Jozani Forest", blurb: lang === "en" ? "Red colobus monkeys, mangrove boardwalk" : t("personalAttention"), seed: "jozani-forest" },
    { name: "South Coast", blurb: lang === "en" ? "Menai Bay, sandbanks & dhow sailing" : t("authenticExp"), seed: "safariblue" },
  ];

  return (
    <>
      {/* Hero — safari blue carousel (11 images, 3s each) unless admin overrides via website_settings */}
      <section className="relative h-[92vh] min-h-[580px] w-full overflow-hidden -mt-[72px] pt-[72px]">
        {/* React Bits PillNav — floating section-jump bar */}
        <div className="absolute top-[88px] right-4 md:right-6 z-20 hidden md:block">
          <HomePillNav />
        </div>
        <HeroCarousel overrideSeed={hp("hero_image_seed", "hero-dhow-sunset")} />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/88 via-indigo-900/30 to-indigo-900/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent hidden md:block" />
        <div className="relative h-full container-page flex flex-col justify-end pb-10 md:pb-14">
          <HeroIntro>
            <HeroItem>
              <p className="font-body text-saffron-300 tracking-[0.2em] text-[11px] md:text-xs uppercase mb-3 md:mb-4">{t("heroKicker")}</p>
            </HeroItem>
            <HeroItem>
              <h1 className="font-display italic font-medium text-[2.6rem] leading-[0.95] md:text-6xl lg:text-[4.75rem] text-stone-50 max-w-3xl text-balance">
                {hp("hero_title", `${t("heroTitle1")} ${t("heroTitle2")}`).split(" ").slice(0, 2).join(" ")}<br />
                <span className="not-italic font-semibold">{hp("hero_title", `${t("heroTitle1")} ${t("heroTitle2")}`).split(" ").slice(2).join(" ") || t("heroTitle2")}</span>
              </h1>
              <p className="sr-only">{hp("hero_title", `${t("heroTitle1")} ${t("heroTitle2")}`)}</p>
            </HeroItem>
            <HeroItem>
              <p className="mt-4 md:mt-5 max-w-xl text-stone-200 text-[15px] md:text-lg leading-relaxed">{hp("hero_subtitle", t("heroDesc"))}</p>
            </HeroItem>
            <HeroItem>
              <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
                <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 active:bg-clove-800 transition-colors text-stone-50 px-6 md:px-7 py-3.5 font-medium shadow-floating">
                  {t("explore")} <ArrowRight size={18} />
                </Link>
                <a href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 hover:bg-white transition-colors px-6 md:px-7 py-3.5 font-medium shadow-card">
                  <MessageCircle size={18} /> {t("chatWhatsApp")}
                </a>
              </div>
            </HeroItem>
            <HeroItem>
              <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white"><ShieldCheck size={14} /></span>
                  {t("licensedLocal")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
                  <Users size={14} className="text-saffron-300" /> {t("smallGroups")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/10 backdrop-blur border border-stone-50/20 text-stone-100 px-3.5 py-2">
                  <Star size={14} className="text-saffron-300 fill-saffron-300" /> {t("directContact")}
                </span>
              </div>
            </HeroItem>
            <HeroItem>
              <div className="hidden md:flex mt-8 items-center gap-2 text-stone-300/70 text-xs tracking-wide">
                <span className="h-8 w-px bg-stone-50/25" />
                {lang === "en" ? "Scroll to discover" : t("explore")}
              </div>
            </HeroItem>
          </HeroIntro>
        </div>
      </section>

      {/* Discovery bar */}
      <section className="container-page -mt-6 md:-mt-8 relative z-10">
        <div className="rounded-2xl bg-white border border-stone-200 shadow-card p-4 md:p-5 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <MapPin size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">{t("where")}</span>
                Stone Town · Spice Farms · Jozani
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <Clock size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">{t("when")}</span>
                {lang === "en" ? "Any date — flexible" : t("flexibleDates")}
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
              <Waves size={16} className="text-clove-600 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">
                <span className="block text-[11px] uppercase tracking-[0.08em] text-stone-500">{t("experience")}</span>
                Culture · Ocean · Nature
              </span>
            </label>
          </div>
          <Link href="/tours" className="inline-flex items-center justify-center gap-2 rounded-full bg-lagoon-700 text-stone-50 px-6 py-3.5 text-sm font-medium hover:bg-lagoon-800 transition-colors shrink-0 shadow-soft w-full md:w-auto">
            {t("explore")} <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-stone-500">{t("everyWayDesc")}</p>
      </section>

      <DoorMotifDivider tone="onLight" className="mt-6" />

      {/* Why local — updated per 2025-09-02 request */}
      <section id="why-local" className="container-page py-12 md:py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
          <div className="md:col-span-5">
            <SectionHeading kicker="Why Experience Zanzibar With a Local?" title="See Zanzibar Beyond the Tourist Route" description="Discover the island through the eyes of someone who knows it personally. Zanzibar is more than the places listed in a guidebook. Its streets have stories, its markets have their own rhythm, and its beaches, farms, food, and communities change with the seasons. We don't simply take you around Zanzibar — we help you experience it." />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {whyLocal.map((w) => (
                <div key={w.k} className="rounded-2xl bg-stone-100 border border-stone-200 p-4">
                  <p className="text-clove-700 text-xs font-medium tracking-widest">{w.k}</p>
                  <h4 className="font-display font-semibold text-stone-900 mt-1">{w.title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed mt-1.5">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-3 md:gap-4">
            <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("stonetown-alley", 800, 600)} alt="Stone Town alley" fill className="object-cover" sizes="(min-width:768px) 40vw, 65vw" />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("spice-tasting", 600, 800)} alt="Spice tasting" fill className="object-cover" sizes="(min-width:768px) 20vw, 30vw" />
            </div>
            <div className="col-span-3 relative aspect-[16/7] rounded-2xl overflow-hidden">
              <Image src={placeholderPhoto("ocean-sandbank", 1200, 500)} alt="White sandbank" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
              <p className="absolute bottom-3 left-4 text-stone-50 text-xs md:text-sm font-medium">Menai Bay · reached by dhow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature — updated 2025-09-02 per request */}
      <section id="signature" className="container-page py-6 md:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading kicker="Unforgettable Zanzibar Experiences" title="Discover the Island Your Way" description="From ancient streets and vibrant local culture to turquoise waters and wild nature, choose an experience that matches the way you want to explore Zanzibar. Private or small-group experiences — thoughtfully designed for meaningful moments, authentic discoveries, and memories that stay with you." />
          <Link href="/tours" className="hidden md:inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm hover:gap-2.5 transition-all shrink-0">
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
        {signature.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500">
            New experiences are on the way — ask us on WhatsApp what’s possible for your dates.
          </p>
        ) : (
          <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6">
            {signature[0] && <StaggerItem><TourCard tour={signature[0]} featured /></StaggerItem>}
            {signature.slice(1, 6).map((t) => (
              <StaggerItem key={t.slug}><TourCard tour={t} /></StaggerItem>
            ))}
          </Stagger>
        )}
        <div className="md:hidden mt-6 text-center">
          <Link href="/tours" className="inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm">{t("viewAll")} <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="bg-stone-100 py-12 md:py-16">
        <div className="container-page">
          <SectionHeading kicker={t("exploreIslandKicker")} title={t("exploreIslandTitle")} align="center" className="mb-8 md:mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {destinations.map((d) => (
              <Link key={d.name} href="/tours" className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900">
                <Image src={placeholderPhoto(d.seed, 600, 800)} alt={d.name} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-entrance" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/85 via-indigo-900/10 to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <h3 className="font-display text-white text-xl font-semibold">{d.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="container-page py-12 md:py-16">
          <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("featured")}</p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-soft">
            <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-xl">
              <Image src={placeholderPhoto(featured.photoSeed, 1000, 800)} alt={featured.title} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
            </div>
            <div className="p-6 md:p-8 md:pr-10">
              <p className="text-clove-600 text-xs uppercase tracking-[0.08em] font-medium">{featured.category}</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2 text-balance">{featured.title}</h3>
              <p className="text-stone-600 leading-relaxed mt-3">{featured.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1.5"><Clock size={14} /> {featured.duration}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1.5"><Users size={14} /> {featured.groupSize}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/tours/${featured.slug}`} className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft">
                  {t("viewExperience")} <ArrowRight size={16} />
                </Link>
                <a href={waLink(`Hi ${business.guideName}, I'd like to book the ${featured.title} tour.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                  <MessageCircle size={16} /> {t("askAbout")}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Guide */}
      <section id="meet-guide" className="container-page py-12 md:py-20">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          <div className="md:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
            <Image src={placeholderPhoto("guide-portrait", 800, 1000)} alt={business.guideName} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-3">
            <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("yourGuide")}</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">{business.guideName}</h2>
            <p className="text-lagoon-700 font-medium text-sm mb-4">{t("licensedGuide")}</p>
            <p className="text-stone-600 leading-relaxed max-w-xl">{business.guideBioShort}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className="inline-flex items-center gap-1.5 text-clove-700 font-medium text-sm hover:gap-2.5 transition-all">{t("readStory")} <ArrowRight size={16} /></Link>
              <a href={waLink(`Hi ${business.guideName}, I'd love to hear more about your tours.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium hover:border-lagoon-300 hover:text-lagoon-700 transition-colors">
                <MessageCircle size={16} /> {t("sayHello")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-100 py-12 md:py-20">
        <div className="container-page">
          <SectionHeading kicker={t("fromTravelers")} title={t("whatGuestsSay")} align="center" className="mb-8 md:mb-12" />
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((tst, i) => (
              <div key={tst.name} className={i === 1 ? "md:mt-6" : ""}>
                <TestimonialCard testimonial={tst} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidence */}
      <section className="container-page py-10 md:py-14">
        <div className="rounded-2xl bg-lagoon-50 border border-lagoon-200 p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-semibold text-lagoon-900">{t("confidenceTitle")}</h3>
            <p className="text-lagoon-700/80 text-sm leading-relaxed mt-2">{t("confidenceDesc")}</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3"><ShieldCheck size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">{t("flexibleDates")}</span><br /><span className="text-stone-600">{t("flexibleDatesDesc")}</span></p></div>
            <div className="flex gap-3"><Users size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">{t("smallGroupsTitle")}</span><br /><span className="text-stone-600">{t("smallGroupsDesc")}</span></p></div>
            <div className="flex gap-3"><MapPin size={18} className="text-lagoon-700 mt-0.5 shrink-0" /><p><span className="font-medium text-lagoon-900">{t("localPickup")}</span><br /><span className="text-stone-600">{t("localPickupDesc")}</span></p></div>
          </div>
        </div>
      </section>

      <DoorMotifDivider tone="onLight" />

      {/* Final CTA — layered hills backdrop */}
      <section className="relative overflow-hidden bg-lagoon-900 text-center">
        <div className="absolute inset-0">
          <HillsBackdrop className="opacity-90" />
        </div>
        <div className="relative container-page py-20 md:py-28">
          <h2 className="font-display italic text-3xl md:text-5xl font-medium max-w-2xl mx-auto text-balance text-stone-50">{t("readyTitle")}</h2>
          <p className="mt-3 text-stone-200 max-w-xl mx-auto">{t("readyDesc")}</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 active:bg-clove-800 transition-colors text-stone-50 px-7 py-3.5 font-medium shadow-floating">
              {t("explore")} <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 hover:bg-white transition-colors px-7 py-3.5 font-medium shadow-card">
              {t("getInTouch")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
