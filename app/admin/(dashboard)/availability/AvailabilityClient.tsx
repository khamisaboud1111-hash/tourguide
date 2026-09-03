"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { setAvailabilityAction } from "@/lib/availability";
import { useLang } from "@/lib/i18n/context";

type TourOpt = { id: string; title: string };
type Row = { date: string; status: string; booked: number; capacity: number };

export default function AvailabilityClient({ initialTours }: { initialTours: TourOpt[] }) {
  const { t } = useLang();
  const [tours] = useState<TourOpt[]>(initialTours);
  const [selected, setSelected] = useState(initialTours[0]?.id ?? "");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const days: string[] = [];
  for (let i = 0; i < 30; i++) days.push(new Date(Date.now() + i * 86400000).toISOString().slice(0, 10));

  const fetchRows = async (tourId: string) => {
    if (!tourId) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("tour_availability").select("*").eq("tour_id", tourId).gte("date", today).lte("date", in30).order("date");
    if (error) setMsg(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    if (selected) fetchRows(selected);
  }, [selected]);

  const handleStatusChange = (date: string, status: string) => {
    const fd = new FormData();
    fd.set("tourId", selected);
    fd.set("date", date);
    fd.set("status", status);
    setMsg(null);
    startTransition(async () => {
      try {
        await setAvailabilityAction(fd);
        setMsg("Saved — availability updated and will show on live site.");
        fetchRows(selected);
        setTimeout(() => setMsg(null), 3000);
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Could not save");
      }
    });
  };

  const availMap = new Map(rows.map((r) => [r.date, r]));

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 mb-1.5">{t("adminTourLabel")}</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm w-full max-w-md">
          {tours.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>{msg}</p>}

      {selected ? (
        <>
          <p className="text-sm text-stone-500 mb-4">{t("adminAvailIntro")}</p>
          {loading ? <p className="text-sm text-stone-500">Loading availability…</p> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {days.map((d) => {
                const row = availMap.get(d);
                const status = row?.status ?? "available";
                const booked = row?.booked ?? 0;
                const cap = row?.capacity ?? 8;
                const color = status === "unavailable" ? "border-clove-300 bg-clove-50" : booked >= cap ? "bg-stone-200" : booked > 0 ? "bg-saffron-50 border-saffron-200" : "border-stone-200 bg-white";
                return (
                  <div key={d} className={`rounded-2xl border p-3 ${color}`}>
                    <p className="text-xs font-medium text-stone-700">{new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
                    <p className="text-[11px] text-stone-500 mb-2">{t("adminBookedCount").replace("{booked}", String(booked)).replace("{cap}", String(cap))}</p>
                    <select value={status} onChange={(e) => handleStatusChange(d, e.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs">
                      <option value="available">{t("adminStatusAvailable")}</option>
                      <option value="limited">{t("adminStatusLimited")}</option>
                      <option value="full">{t("adminStatusFull")}</option>
                      <option value="unavailable">{t("adminStatusBlocked")}</option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-stone-500">{t("adminAddPublishedTourFirst")}</p>
      )}
    </div>
  );
}
