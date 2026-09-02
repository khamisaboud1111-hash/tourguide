"use client";

import { MessageCircle } from "lucide-react";
import { waLink, business } from "@/lib/constants";
import { useLang } from "@/lib/i18n/context";

export default function StickyBookingBar({ price, title, slug }: { price: number; title: string; slug: string }) {
  const { t } = useLang();
  const wa = waLink(`Hi ${business.guideName}, I'm interested in the ${title} tour (${slug}). Is it available?`);
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-floating" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1">
          <p className="text-xs text-stone-500 mt-1">{t("flexibleDateConfirm")}</p>
        </div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-lagoon-700 text-white px-4 py-2.5 text-sm font-medium hover:bg-lagoon-800 transition-colors shrink-0"
        >
          <MessageCircle size={16} /> {t("askShort")}
        </a>
        <a
          href="#booking"
          className="inline-flex items-center gap-1 rounded-full bg-clove-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-clove-700 transition-colors shrink-0 shadow-soft"
        >
{t("bookNow")}
        </a>
      </div>
    </div>
  );
}
