"use client";

import { AreaChart, BarChart, DonutChart, MetricCard } from "@/components/admin/Charts";
import { TrendingUp, Users, CalendarCheck, Star } from "lucide-react";
import { useLang } from "@/lib/i18n/context";

export default function AdminAnalyticsPage() {
  const { t } = useLang();
  const revenueData = [
    { label: "Jan", value: 3200 },
    { label: "Feb", value: 4100 },
    { label: "Mar", value: 3800 },
    { label: "Apr", value: 5200 },
    { label: "May", value: 6100 },
    { label: "Jun", value: 5800 },
    { label: "Jul", value: 7200 },
    { label: "Aug", value: 8100 },
  ];

  const bookingsData = [
    { label: "Jan", value: 80 },
    { label: "Feb", value: 110 },
    { label: "Mar", value: 95 },
    { label: "Apr", value: 140 },
    { label: "May", value: 165 },
    { label: "Jun", value: 150 },
    { label: "Jul", value: 190 },
    { label: "Aug", value: 215 },
  ];

  const sourcesData = [
    { label: "Website", value: 45, color: "#8B3A2B" },
    { label: "Referral", value: 25, color: "#142825" },
    { label: "Social", value: 20, color: "#C08A2E" },
    { label: "Other", value: 10, color: "#B0B0B0" },
  ];

  const topTours = [
    { name: "Kilimanjaro Trek", bookings: 124 },
    { name: "Safari Classic", bookings: 98 },
    { name: "Zanzibar Escape", bookings: 87 },
    { name: "Ngorongoro Day Trip", bookings: 64 },
    { name: "Serengeti Migration", bookings: 52 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{t("adminAnalyticsTitle")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title={t("adminAnalyticsRevenueYtd")} value="$43,200" change={18} changeLabel={t("adminAnalyticsVsLastYear")} icon={<TrendingUp size={20} />} color="clove" />
        <MetricCard title={t("adminAnalyticsBookings30d")} value="215" change={12} changeLabel={t("adminAnalyticsVsLastMonth")} icon={<CalendarCheck size={20} />} color="lagoon" />
        <MetricCard title={t("adminAnalyticsNewCustomers")} value="128" change={8} changeLabel={t("adminAnalyticsVsLastMonth")} icon={<Users size={20} />} color="saffron" />
        <MetricCard title={t("adminAnalyticsAvgRating")} value="4.8/5" change={2} changeLabel={t("adminAnalyticsVsLastMonth")} icon={<Star size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminAnalyticsRevenueOverview")}</h2>
          <AreaChart data={revenueData} color="clove" height={220} />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminAnalyticsBookingsPerMonth")}</h2>
          <BarChart data={bookingsData} color="lagoon" height={220} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminAnalyticsBookingSources")}</h2>
          <DonutChart data={sourcesData} size={180} />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminAnalyticsTopTours")}</h2>
          <div className="space-y-4">
            {topTours.map((t, i) => (
              <div key={t.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">{t.name}</p>
                  <div className="mt-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-clove-500 rounded-full" style={{ width: `${(t.bookings / 124) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-medium text-stone-600">{t.bookings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}