import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/SocialIcons";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import TourMapLoader from "@/components/TourMapLoader";
import { business, waLink } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { rowToTour } from "@/lib/tours";
import { getLang, tServer } from "@/lib/i18n/server";
import CursorTrailContact from "@/components/CursorTrailContact";

export const metadata: Metadata = {
  title: `Contact — ${business.name}`,
  description: `Plan your Zanzibar trip with ${business.guideName}. WhatsApp fastest, maps and meeting points included.`,
};

export const revalidate = 60;

export default async function ContactPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("*").eq("is_published", true).order("title");
  const tours = (data ?? []).map(rowToTour);

  return (
    <div>
      <CursorTrailContact />
      <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("contact")}</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">{t("readyTitle")}</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">Message directly — no agency, no forms that vanish. WhatsApp is fastest and you&apos;ll talk to your guide in person.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-6">
          <div className="rounded-2xl bg-lagoon-50 border border-lagoon-200 p-6">
            <a
              href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lagoon-700 hover:bg-lagoon-800 transition-colors text-white px-6 py-3.5 font-medium shadow-soft"
            >
              <MessageCircle size={18} /> Fastest: chat on WhatsApp
            </a>
            <ul className="mt-6 space-y-3 text-sm text-stone-700">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 shrink-0"><Phone size={14} className="text-clove-600" /></span>
                {business.phoneDisplay}
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 shrink-0"><Mail size={14} className="text-clove-600" /></span>
                <a href={`mailto:${business.email}`} className="hover:text-clove-600 transition-colors">{business.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 shrink-0"><MapPin size={14} className="text-clove-600" /></span>
                {business.location}
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200 shrink-0"><Clock size={14} className="text-clove-600" /></span>
                Replies usually within a few hours (Zanzibar time)
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-6 pt-5 border-t border-lagoon-200">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-500 mb-2">Follow us</p>
              <div className="flex flex-wrap gap-2">
                <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-lagoon-300 hover:text-lagoon-700 transition-colors">
                  <FacebookIcon size={13} /> Facebook · Abdul Hamid
                </a>
                <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-lagoon-300 hover:text-lagoon-700 transition-colors">
                  <TikTokIcon size={13} /> TikTok · Sitmeir Tour &amp; Travel
                </a>
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium hover:border-lagoon-300 hover:text-lagoon-700 transition-colors">
                  <InstagramIcon size={13} /> @sitmeirtourtravel
                </a>
              </div>
              <p className="text-xs text-stone-500 mt-2">Email — <a href={`mailto:${business.email}`} className="underline hover:text-lagoon-700">{business.email}</a></p>
              <div className="mt-3">
                <Link href="/book" className="text-xs font-medium text-lagoon-700 hover:underline">Prefer to book online? → Book your experience</Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-2">Where we meet</h3>
            <p className="text-sm text-stone-600 mb-3">{business.location} — exact meeting point per tour is shown on its page with a map.</p>
            <div className="h-64 md:h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-soft">
              <TourMapLoader lat={business.mapCenter.lat} lng={business.mapCenter.lng} label={business.location} zoom={12} />
            </div>
          </div>

          <div className="rounded-2xl bg-stone-100 border border-stone-200 p-5">
            <h3 className="font-display font-semibold text-sm">What to include in your message</h3>
            <ul className="mt-2 text-sm text-stone-600 list-disc list-inside space-y-1">
              <li>Dates you&apos;re in Zanzibar</li>
              <li>How many travelers</li>
              <li>Any must-sees (Stone Town, spice, reef, Jozani)</li>
              <li>Hotel name if you need pickup advice</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-6 md:p-8">
          <h3 className="font-display text-xl font-semibold">Send a message</h3>
          <p className="text-sm text-stone-600 mt-1">This opens WhatsApp with your message ready to send — nothing is stored on this site unless you submit a booking request.</p>
          <div className="mt-6">
            <ContactForm tours={tours} />
          </div>
        </div>
      </div>

      {/* FAQ quick */}
      <section className="mt-14 rounded-2xl bg-stone-50 border border-stone-200 p-6 md:p-8">
        <h3 className="font-display text-xl font-semibold">Quick answers</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl bg-white border border-stone-200 p-4"><p className="font-medium">Can we customize?</p><p className="text-stone-600 mt-1">Yes — group size, timing and pace are flexible. Just ask.</p></div>
          <div className="rounded-xl bg-white border border-stone-200 p-4"><p className="font-medium">Private tours?</p><p className="text-stone-600 mt-1">Available for most experiences — note &quot;private&quot; on WhatsApp.</p></div>
          <div className="rounded-xl bg-white border border-stone-200 p-4"><p className="font-medium flex items-center gap-1">Cancellation <ArrowRight size={12} className="opacity-50" /></p><p className="text-stone-600 mt-1">Flexible until confirmed. Message to adjust for weather.</p></div>
        </div>
      </section>
      </div>
    </div>
  );
}
