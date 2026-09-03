import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import AvailabilityClient from "./AvailabilityClient";

export default async function AdminAvailabilityPage() {
  const lang = getLang();
  const supabase = await createClient();
  let tours: Array<{ id: string; title: string }> = [];
  let toursError: string | null = null;
  try {
    const { data, error } = await supabase.from("tours").select("id, title").eq("is_published", true).order("title");
    if (error) toursError = error.message;
    else tours = (data as unknown) as typeof tours;
  } catch (e: unknown) {
    toursError = e instanceof Error ? e.message : "Could not load tours";
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminAvailability", lang)}</h1>
      {toursError && (
        <p className="mb-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm px-4 py-3">
          Tours: {toursError} — showing intended content. Try again.
        </p>
      )}
      {tours.length === 0 ? (
        <p className="text-sm text-stone-500">{tServer("adminAddPublishedTourFirst", lang)}</p>
      ) : (
        <AvailabilityClient initialTours={tours} />
      )}
    </div>
  );
}
