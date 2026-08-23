import type { Metadata } from "next";
import { business } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { rowToTour } from "@/lib/tours";
import ToursExplorer from "@/components/ToursExplorer";

export const metadata: Metadata = {
  title: `Experiences — ${business.name}`,
  description: "Culture, ocean, nature — every way to see Zanzibar with a local guide. Small groups, flexible days.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  const tours = (data ?? []).map(rowToTour);

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-saffron-600 text-xs uppercase tracking-[0.2em] font-medium mb-3">
        Experiences
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">
        Every way we know to show you the island
      </h1>
      <p className="mt-4 text-stone-600 max-w-xl leading-relaxed">
        Culture, ocean, nature — pick what calls you, or mix them. Each tour adjusts for group size, timing and pace — message on WhatsApp if you&apos;d like something custom.
      </p>

      <div className="mt-8">
        {tours.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-500">
            No tours published yet — add some from the admin dashboard at <span className="font-medium">/admin</span>.
          </p>
        ) : (
          <ToursExplorer tours={tours} />
        )}
      </div>
    </div>
  );
}
