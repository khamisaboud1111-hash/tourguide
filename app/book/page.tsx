import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Users, User, Mail, Check, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { business, waLink } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { rowToTour } from "@/lib/tours";
import BookOnlineForm from "@/components/BookOnlineForm";
import { getLang, tServer } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: `Book Online — ${business.name}`,
  description: "Book your Zanzibar experience online in a few steps. Pick a tour, choose a date, and your guide confirms directly.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("*").eq("is_published", true).order("title");
  const tours = (data ?? []).map(rowToTour);

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("planTrip")}</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">{t("bookOnlinePageTitle")}</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">
        {t("bookOnlinePageDesc").replace("{name}", business.guideName)}
      </p>

      <div className="mt-10 grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Booking form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-6 md:p-8">
            <BookOnlineForm tours={tours.map((t) => ({ id: t.id ?? "", slug: t.slug, title: t.title, priceUsd: t.priceUsd, duration: t.duration, groupSize: t.groupSize }))} />
          </div>
        </div>

        {/* Trust sidebar */}
        <aside className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-lagoon-50 border border-lagoon-200 p-6">
            <h3 className="font-display font-semibold text-lagoon-900 flex items-center gap-2"><ShieldCheck size={18} /> {t("howBookingWorks")}</h3>
            <ol className="mt-4 space-y-3 text-sm text-stone-700">
              {[
                t("stepBook1"),
                t("stepBook2"),
                t("stepBook3"),
                t("stepBook4").replace("{name}", business.guideName),
                `Pay the ${business.depositPercent * 100}% deposit online or the full amount on the day.`,
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-lagoon-700 text-white text-xs font-medium shrink-0">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-6">
            <h3 className="font-display font-semibold text-sm">{t("includedEveryBooking")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {[t("incLicensedGuide"), t("incFreeChanges"), t("incWhatsapp"), t("incMeetingPoint")].map((x) => (
                <li key={x} className="flex items-start gap-2"><Check size={15} className="text-lagoon-600 mt-0.5 shrink-0" /> {x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-6">
            <h3 className="font-display font-semibold text-sm">{t("preferToChatFirst")}</h3>
            <p className="text-sm text-stone-600 mt-1">{t("chatReplyFast")}</p>
            <a href={waLink(`Hi ${business.guideName}, I'd like to ask about booking a tour.`)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-lagoon-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-lagoon-800 transition-colors shadow-soft">
              <MessageCircle size={16} /> {t("whatsappLabel").replace("{phone}", business.phoneDisplay)}
            </a>
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-6">
            <h3 className="font-display font-semibold text-sm">{t("notSureWhichTour")}</h3>
            <Link href="/tours" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-clove-700 hover:gap-2.5 transition-all">
              {t("browseAllExperiences")} <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
