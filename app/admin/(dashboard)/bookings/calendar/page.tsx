"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useLang } from "@/lib/i18n/context";

const mockBookings = [
  { day: 5, customer: "John M.", tour: "Kilimanjaro Trek", time: "09:00", status: "confirmed" },
  { day: 8, customer: "Sarah K.", tour: "Safari Classic", time: "07:30", status: "pending" },
  { day: 12, customer: "David L.", tour: "Zanzibar Escape", time: "10:00", status: "confirmed" },
  { day: 15, customer: "Grace M.", tour: "Ngorongoro Day Trip", time: "08:00", status: "confirmed" },
  { day: 20, customer: "Peter A.", tour: "Serengeti Migration", time: "09:30", status: "confirmed" },
];

export default function AdminBookingCalendarPage() {
  const { t } = useLang();
  const [month, setMonth] = useState("August 2026");
  const weekdays = [
    t("adminWeekdayMon"),
    t("adminWeekdayTue"),
    t("adminWeekdayWed"),
    t("adminWeekdayThu"),
    t("adminWeekdayFri"),
    t("adminWeekdaySat"),
    t("adminWeekdaySun"),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminBookingCalendarTitle")}</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50" aria-label={t("adminCalendarPrevMonth")}>
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium text-stone-700 min-w-[140px] text-center">{month}</span>
          <button className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50" aria-label={t("adminCalendarNextMonth")}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-stone-500 py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const dayBookings = mockBookings.filter((b) => b.day === day);
          return (
            <div
              key={day}
              className={`min-h-[90px] rounded-xl border p-2 transition-colors ${
                dayBookings.length
                  ? "border-clove-200 bg-clove-50/40 hover:border-clove-400"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <span className="text-xs font-medium text-stone-600">{day}</span>
              <div className="mt-1 space-y-1">
                {dayBookings.map((b, idx) => (
                  <div
                    key={idx}
                    className={`rounded px-1.5 py-0.5 text-[10px] leading-tight ${
                      b.status === "confirmed"
                        ? "bg-lagoon-100 text-lagoon-800"
                        : "bg-saffron-50 text-saffron-700"
                    }`}
                    title={`${b.customer} — ${b.tour}`}
                  >
                    {b.time} · {b.customer.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <CalendarDays size={18} className="text-clove-600" /> {t("adminCalendarLegend")}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-lagoon-100 border border-lagoon-200 inline-block" /> {t("adminStatusConfirmed")}</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-saffron-50 border border-saffron-200 inline-block" /> {t("adminStatusPending")}</span>
        </div>
      </div>
    </div>
  );
}