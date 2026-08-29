import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getLang, tServer } from "@/lib/i18n/server";
import { business, waLink } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <CheckCircle2 className="mx-auto text-lagoon-600 mb-4" size={48} />
        <h1 className="font-display text-2xl font-semibold mb-2">{t("bookingRequestReceived")}</h1>
        <p className="text-stone-600 mb-1">
          {ref ? (
            <>Your reference <span className="font-mono font-semibold">{ref}</span> was received.</>
          ) : (
            "Your booking request was received."
          )}
        </p>
        <p className="text-sm text-stone-500 mb-8">
          The guide will confirm your date and share the meeting point. No payment is taken online — you settle on the day.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 transition-colors text-white px-6 py-3 font-medium">
            {t("backToTours")}
          </Link>
          <a
            href={waLink(`Hi ${business.guideName}, I just submitted a booking request${ref ? ` (${ref})` : ""} and wanted to confirm my date.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-lagoon-700 text-white px-6 py-3 font-medium hover:bg-lagoon-800 transition-colors"
          >
            <MessageCircle size={18} /> {t("whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
