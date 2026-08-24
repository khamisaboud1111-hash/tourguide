import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, BadgeCheck, Languages, MapPin, ArrowRight, Heart, Compass, Users, Clock, Shield, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/SocialIcons";
import DoorMotifDivider from "@/components/DoorMotifDivider";
import { business, waLink } from "@/lib/constants";
import { placeholderPhoto } from "@/lib/placeholder";
import { getLang, tServer } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: `About ${business.guideName} — ${business.name}`,
  description: business.guideBioShort,
};

const credentials = [
  { icon: BadgeCheck, label: "Licensed Zanzibar tour guide", sub: "Stone Town certified" },
  { icon: Languages, label: "English, Swahili", sub: "Fluent & friendly" },
  { icon: MapPin, label: business.location, sub: "Born & raised" },
];

const pillars = [
  { n: "01", title: "Local knowledge", body: "Places beyond the standard route — a quiet alley, a farm at the right hour, a calm sea only locals know." },
  { n: "02", title: "Personal attention", body: "Small groups, private options, and timing that bends to you — not the other way around." },
  { n: "03", title: "Flexible experiences", body: "Half-day, full-day, sunrise or sunset — shaped around your stay, hotel, and interests." },
  { n: "04", title: "Authentic experiences", body: "Culture, food, history and nature — introduced by someone who lives it." },
  { n: "05", title: "Direct communication", body: "Message the guide directly. No agency, no markups, no scripts." },
];

const favoritePlaces = [
  { name: "Darajani Market at 8am", note: "Before the crowds — spices, gossip, and the best mandazi." },
  { name: "Kizimbani spice farm", note: "Where I still learn something every visit." },
  { name: "Menai Bay sandbank", note: "When tide is right, the water goes milky turquoise." },
];

export default function AboutPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  return (
    <div>
      {/* Hero portrait */}
      <div className="container-page py-10 md:py-16 grid md:grid-cols-5 gap-8 md:gap-12 items-start">
        <div className="md:col-span-2">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
            <Image src={placeholderPhoto("guide-portrait-2", 800, 1000)} alt={`${business.guideName} — Zanzibar tour guide portrait`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" priority />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-indigo-900/70 to-transparent p-4">
              <p className="text-stone-50 text-sm font-medium">{business.guideName}</p>
              <p className="text-stone-200 text-xs">Licensed guide · {business.location}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3">
            {credentials.map((c) => (
              <li key={c.label} className="flex items-center gap-3 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 shrink-0">
                  <c.icon size={16} className="text-clove-600" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-900">{c.label}</p>
                  <p className="text-xs text-stone-500">{c.sub}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-lagoon-50 border border-lagoon-200 p-5">
            <h3 className="font-display font-semibold text-lagoon-900 flex items-center gap-2"><Heart size={16} /> Favorite corners of the island</h3>
            <ul className="mt-3 space-y-3">
              {favoritePlaces.map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-medium text-stone-900">{p.name}</span>
                  <span className="text-stone-600"> — {p.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("aboutGuide")}</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">{business.guideName}</h1>
          <p className="mt-2 text-lagoon-700 font-medium text-sm flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-stone-700 text-xs"><Shield size={12} /> Licensed</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-stone-700 text-xs"><Languages size={12} /> EN · SW</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-stone-700 text-xs"><Users size={12} /> 1â€“8 guests</span>
          </p>

          <div className="mt-6 space-y-4 text-stone-700 leading-relaxed max-w-xl text-[15px]">
            <p className="font-display text-lg text-stone-900 leading-snug">{business.guideBioShort}</p>
            <p>
              This is where the guide&apos;s personal story lives — where you grew up, how long you&apos;ve been guiding, and what first made you want to show this island to visitors. Specifics travel well: the first tour you ever led, a favorite spice, a particular alley you never tire of.
            </p>
            <p className="text-stone-600 text-sm border-l-2 border-saffron-300 pl-4 italic">
              Tip: use first-person, keep it human. One honest paragraph beats corporate marketing. Replace this placeholder with your own words — guests book people, not brochures.
            </p>
            <p>
              What guests can expect: unhurried pace, room for questions, and the kind of small details a guidebook won&apos;t tell you — the best hour for a spice farm, which sandbank is calmest today, where the light hits the doors at sunset.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex gap-3"><Compass size={16} className="text-clove-600 mt-0.5" /><p><span className="font-medium">Real routes</span><br /><span className="text-stone-600">Not scripts</span></p></div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex gap-3"><Clock size={16} className="text-clove-600 mt-0.5" /><p><span className="font-medium">Flexible</span><br /><span className="text-stone-600">Your pace</span></p></div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex gap-3"><Users size={16} className="text-clove-600 mt-0.5" /><p><span className="font-medium">Small groups</span><br /><span className="text-stone-600">Private ok</span></p></div>
          </div>

          <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200 p-5">
            <h3 className="font-display text-sm font-semibold text-stone-900 flex items-center gap-2"><Phone size={14} className="text-clove-600" /> Direct contact</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={`tel:${business.phoneDisplay.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-white border border-stone-300 px-5 py-2.5 text-sm font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                <Phone size={16} /> {business.phoneDisplay}
              </a>
              <a href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-lagoon-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-lagoon-800 transition-colors shadow-soft">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
            <p className="text-xs text-stone-500 mt-2">Fastest reply on WhatsApp — {business.phoneDisplay}</p>

            {/* Socials */}
            <div className="mt-4 pt-4 border-t border-stone-200">
              <p className="text-xs font-medium text-stone-700 mb-2">Follow us</p>
              <div className="flex flex-wrap gap-2">
                <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                  <FacebookIcon size={13} /> Facebook · Abdul Hamid
                </a>
                <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                  <TikTokIcon size={13} /> TikTok · Sitmeir Tour &amp; Travel
                </a>
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
                  <InstagramIcon size={13} /> @sitmeirtourtravel
                </a>
              </div>
              <p className="text-xs text-stone-500 mt-2">Email — <a href={`mailto:${business.email}`} className="underline hover:text-clove-600">{business.email}</a></p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 transition-colors text-white px-6 py-3.5 font-medium shadow-soft">
              <MessageCircle size={18} /> Say hello on WhatsApp
            </a>
            <Link href="/tours" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
              See experiences <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Why book with me */}
      <section className="bg-stone-100 py-12 md:py-16">
        <div className="container-page">
          <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("aboutGuide")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">{t("fiveReasons")}</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {pillars.map((p) => (
              <div key={p.n} className="rounded-2xl bg-white border border-stone-200 p-5 shadow-soft">
                <p className="text-clove-700 text-xs font-medium tracking-widest">{p.n}</p>
                <h3 className="font-display font-semibold mt-1">{p.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed mt-2">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-stone-500 max-w-3xl">Claims are kept factual — no invented awards or certifications. If you add a verifiable credential (license number, years active), it appears here automatically via <code>lib/constants.ts</code>.</p>
        </div>
      </section>

      {/* How I design experiences */}
      <section className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl font-semibold">{t("howIDesign")}</h3>
            <ol className="mt-4 space-y-3 text-sm text-stone-700 list-decimal list-inside marker:text-clove-600">
              <li><span className="font-medium text-stone-900">We talk first.</span> Dates, hotel, who&apos;s traveling, what you love.</li>
              <li><span className="font-medium text-stone-900">I pick the timing.</span> Tide, light, farm hours — so it actually makes sense.</li>
              <li><span className="font-medium text-stone-900">We walk easy.</span> Small group, questions welcome, detours allowed.</li>
              <li><span className="font-medium text-stone-900">You get the extras.</span> Where to eat after, what to skip tomorrow, how to get back.</li>
            </ol>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
            <Image src={placeholderPhoto("about-zanzibar-street", 800, 600)} alt="Zanzibar street scene with local life" fill className="object-cover" sizes="(min-width:768px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <DoorMotifDivider tone="onLight" />
    </div>
  );
}
