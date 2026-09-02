import { createClient } from "@/lib/supabase/server";
import { setAvailabilityAction } from "@/lib/availability";
import { getLang, tServer } from "@/lib/i18n/server";

const inputClasses =
  "rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-clove-500";

export default async function AdminAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour: tourId } = await searchParams;
  const lang = getLang();
  const supabase = await createClient();
  let tours: Array<{ id: string; title: string }> | null = null;
  let toursError: string | null = null;
  try {
    const { data, error } = await supabase.from("tours").select("id, title").eq("is_published", true).order("title");
    if (error) toursError = error.message;
    else tours = (data as unknown) as Array<{ id: string; title: string }>;
  } catch (e: unknown) {
    toursError = e instanceof Error ? e.message : "Could not load tours";
  }

  const selected = tourId || tours?.[0]?.id || "";
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  let rows: Array<{ date: string; status: string; booked: number; capacity: number }> | null = null;
  let rowsError: string | null = null;
  try {
    const res = selected
      ? await supabase.from("tour_availability").select("*").eq("tour_id", selected).gte("date", today).lte("date", in30).order("date")
      : { data: [] as never[], error: null };
    if ((res as { error: { message: string } | null }).error) rowsError = (res as { error: { message: string } }).error.message;
    else rows = (res.data ?? []) as unknown as Array<{ date: string; status: string; booked: number; capacity: number }>;
  } catch (e: unknown) {
    rowsError = e instanceof Error ? e.message : "Could not load availability";
  }

  // Generate next 30 days grid
  const days: string[] = [];
  for (let i = 0; i < 30; i++) {
    days.push(new Date(Date.now() + i * 86400000).toISOString().slice(0, 10));
  }
  const availMap = new Map((rows ?? []).map((r) => [r.date, r]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminAvailability", lang)}</h1>
      {(toursError || rowsError) && (
        <p className="mb-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm px-4 py-3">
          {toursError ? `Tours: ${toursError}` : ""} {rowsError ? `Availability: ${rowsError}` : ""} — showing intended content with empty data. Try again or check Supabase RLS.
        </p>
      )}

      <form method="get" className="mb-6">
        <label className="block text-sm font-medium text-stone-700 mb-1.5">{tServer("adminTourLabel", lang)}</label>
        <select name="tour" defaultValue={selected} className={`${inputClasses} w-full max-w-md`}>
          {(tours ?? []).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <button className="ml-2 rounded-xl bg-clove-600 text-white px-4 py-2 text-sm font-medium hover:bg-clove-700 transition-colors">{tServer("adminLoad", lang)}</button>
      </form>

      {selected && (
        <>
          <p className="text-sm text-stone-500 mb-4">{tServer("adminAvailIntro", lang)}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {days.map((d) => {
              const row = availMap.get(d);
              const status = row?.status ?? "available";
              const booked = row?.booked ?? 0;
              const cap = row?.capacity ?? 8;
              const color =
                status === "unavailable" ? "border-clove-300 bg-clove-50" :
                booked >= cap ? "bg-stone-200" :
                booked > 0 ? "bg-saffron-50 border-saffron-200" :
                "border-stone-200 bg-white";
              return (
                <form key={d} action={setAvailabilityAction} className={`rounded-2xl border p-3 ${color}`}>
                  <input type="hidden" name="tourId" value={selected} />
                  <input type="hidden" name="date" value={d} />
                  <p className="text-xs font-medium text-stone-700">{new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
                  <p className="text-[11px] text-stone-500 mb-2">{tServer("adminBookedCount", lang).replace("{booked}", String(booked)).replace("{cap}", String(cap))}</p>
                  <select name="status" defaultValue={status} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                    <option value="available">{tServer("adminStatusAvailable", lang)}</option>
                    <option value="limited">{tServer("adminStatusLimited", lang)}</option>
                    <option value="full">{tServer("adminStatusFull", lang)}</option>
                    <option value="unavailable">{tServer("adminStatusBlocked", lang)}</option>
                  </select>
                  <noscript><button className="mt-1 text-[11px] underline">{tServer("adminSave", lang)}</button></noscript>
                </form>
              );
            })}
          </div>
        </>
      )}
      {!selected && <p className="text-sm text-stone-500">{tServer("adminAddPublishedTourFirst", lang)}</p>}
    </div>
  );
}
