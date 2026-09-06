"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Trash2, CalendarX } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { createCalendarEvent, deleteCalendarEvent } from "@/app/actions/calendar";

type BookingDay = {
  day: number;
  customer: string;
  tour: string;
  time: string;
  status: string;
  kind: "booking" | "event";
  id?: string;
  whatsapp?: string;
};

export default function AdminBookingCalendarPage() {
  const { t } = useLang();
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [bookings, setBookings] = useState<BookingDay[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const month = baseDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const weekdays = [
    t("adminWeekdayMon"),
    t("adminWeekdayTue"),
    t("adminWeekdayWed"),
    t("adminWeekdayThu"),
    t("adminWeekdayFri"),
    t("adminWeekdaySat"),
    t("adminWeekdaySun"),
  ];

  const refresh = () => {
    const supabase = createClient();
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString().slice(0, 10);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).toISOString().slice(0, 10);
    supabase
      .from("bookings")
      .select("requested_date, customer_name, tour_title_snapshot, status, created_at, whatsapp")
      .gte("requested_date", start)
      .lte("requested_date", end)
      .then(({ data }) => {
        const mapped: BookingDay[] = (data ?? [])
          .filter((b) => b.requested_date)
          .map((b) => {
            const d = new Date(b.requested_date as string);
            return {
              day: d.getDate(),
              customer: (b.customer_name as string) || "Guest",
              tour: (b.tour_title_snapshot as string) || "Tour",
              time: new Date(b.created_at as string).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
              status: (b.status as string) || "pending",
              whatsapp: (b.whatsapp as string) || "",
              kind: "booking" as const,
            };
          });
        // also fetch custom reminder events
        supabase.from("calendar_events").select("id, title, date, notes").gte("date", start).lte("date", end).then(({ data: evts }) => {
          const evMapped: BookingDay[] = (evts ?? []).map((e) => {
            const d = new Date(e.date as string);
            return {
              day: d.getDate(),
              customer: (e.title as string),
              tour: (e.notes as string) || "Reminder",
              time: "•",
              status: "event",
              whatsapp: "",
              kind: "event" as const,
              id: e.id as string,
            };
          });
          setBookings([...mapped, ...evMapped]);
        });
      });
  };

  useEffect(() => {
    refresh();
  }, [baseDate]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) {
      setMsg("Title and date required");
      return;
    }
    const fd = new FormData();
    fd.set("title", newTitle.trim());
    fd.set("date", newDate);
    fd.set("notes", newNotes.trim());
    setMsg(null);
    startTransition(async () => {
      try {
        await createCalendarEvent(fd);
        setMsg("Event added — will remind you on that date.");
        setNewTitle("");
        setNewNotes("");
        setShowNewEvent(false);
        refresh();
      } catch (err: unknown) {
        setMsg(err instanceof Error ? err.message : "Could not add event");
      }
    });
  };

  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminBookingCalendarTitle")}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1))}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50"
            aria-label={t("adminCalendarPrevMonth")}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium text-stone-700 min-w-[140px] text-center">{month}</span>
          <button
            onClick={() => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1))}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50"
            aria-label={t("adminCalendarNextMonth")}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Add event button - always visible */}
      <button
        onClick={() => setShowNewEvent(true)}
        className="inline-flex items-center gap-2 rounded-full border border-clove-300 bg-clove-50 text-clove-700 px-4 py-2 text-sm font-medium hover:bg-clove-100 transition-colors mb-4"
      >
        <Plus size={14} /> {t("adminAddEvent")}
      </button>

      {/* New event form - slide in */}
      {showNewEvent && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur flex items-center justify-center p-4" onClick={(e) => e.currentTarget !== e.target && setShowNewEvent(false)}>
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform scale-95 opacity-0 transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-semibold mb-4">{t("adminAddEvent")}</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Reminder title *</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Call supplier, block date"
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Notes</label>
                <input
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional note"
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-clove-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-clove-700 disabled:opacity-60">
                  <Plus size={14} /> {isPending ? "Adding…" : t("adminAddEvent")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEvent(false)}
                  className="flex-1 rounded-lg border border-stone-200 text-stone-700 px-3 py-2 text-sm hover:bg-stone-50 transition-colors"
                >
                  {t("adminCancel")}
                </button>
              </div>
            </form>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-clove-300 text-clove-700 px-4 py-2 text-sm font-medium hover:bg-clove-100 transition-colors"
              onClick={() => setShowNewEvent(false)}
            >
              {t("adminClose")}
            </button>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dayBookings = bookings.filter((b) => b.day === day);
          return (
            <div
              key={day}
              className={`min-h-[100px] rounded-xl border p-2 transition-colors cursor-pointer hover:shadow-lg ${
                dayBookings.length
                  ? "border-clove-200 bg-clove-50/40"
                  : "border-stone-200 bg-stone-50"
              }`}
              onClick={() => {
                // Scroll to day or show details
                window.dispatchEvent(new CustomEvent("calendarDayClick", { detail: { day } }));
              }}
            >
              <span className="text-xs font-medium text-stone-600">{day}</span>
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {dayBookings.map((b, idx) => (
                  <div
                    key={idx}
                    className={`rounded px-1.5 py-0.5 text-[10px] leading-tight flex items-center justify-between gap-1 ${
                      b.kind === "event"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : b.status === "confirmed"
                          ? "bg-lagoon-100 text-lagoon-800"
                          : "bg-saffron-50 text-saffron-700"
                    }`}
                    title={`${b.customer} — ${b.tour} ${b.whatsapp ? `- WhatsApp: ${b.whatsapp}` : ""}`}
                  >
                    <span>{b.time} · {b.customer.split(" ")[0]}</span>
                    {b.kind === "event" && b.id && (
                      <button
                        onClick={() => startTransition(async () => { await deleteCalendarEvent(b.id!); refresh(); })}
                        className="text-indigo-400 hover:text-indigo-700"
                        aria-label="Delete event"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
                {dayBookings.length === 0 && (
                  <div className="text-xs text-stone-400 py-2">{t("adminNoEvents")}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <CalendarDays size={18} className="text-clove-600" /> {t("adminCalendarLegend")}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-lagoon-100 border border-lagoon-200 inline-block" /> {t("adminStatusConfirmed")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-saffron-50 border border-saffron-200 inline-block" /> {t("adminStatusPending")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-indigo-100 border border-indigo-200 inline-block" /> {t("adminStatusEvent")}
          </span>
        </div>
      </div>
    </div>
  );
}