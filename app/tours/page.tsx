import type { Metadata } from "next";
import { business } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { rowToTour } from "@/lib/tours";
import ToursExplorer from "@/components/ToursExplorer";
import { getLang, tServer } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: `Experiences — ${business.name}`,
  description: "From Stone Town culture to turquoise waters, spice farms and wild nature — choose your Zanzibar experience or combine them. Tailored to your group, schedule and pace.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  const tours = (data ?? []).map(rowToTour);

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">
        {t("experiences")}
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">
        {t("everyWayTitle")}
      </h1>
      <p className="mt-4 text-stone-600 max-w-xl leading-relaxed">
        {t("everyWayDesc")}
      </p>

      <div className="mt-8">
        {tours.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500">
            {t("noMatchTours")}
          </p>
        ) : (
          <ToursExplorer tours={tours} />
        )}
      </div>
    </div>
  );
}
