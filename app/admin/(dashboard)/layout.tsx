"use client";

import Link from "next/link";
import {
  LayoutDashboard, MapPin, Inbox, LogOut, ExternalLink, CalendarDays,
  Star, BookOpen, Settings, Image, Bell,
  CalendarRange, PlusCircle, FolderTree, DollarSign,
  Lock, Share2, FileText, MessageSquare, BarChart3,
  LayoutGrid,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { business } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import BookingNotifier from "@/components/admin/BookingNotifier";
import { useLang } from "@/lib/i18n/context";

type NavItem = { href: string; labelKey: string; icon: React.ComponentType<{ size?: number | string; className?: string }> };
type NavGroup = { titleKey: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    titleKey: "adminGroupMain",
    items: [
      { href: "/admin", labelKey: "adminNavOverview", icon: LayoutDashboard },
      { href: "/admin/notifications", labelKey: "adminNavNotifications", icon: Bell },
    ],
  },
  {
    titleKey: "adminGroupSales",
    items: [
      { href: "/admin/bookings", labelKey: "adminNavBookings", icon: Inbox },
      { href: "/admin/bookings/calendar", labelKey: "adminNavCalendar", icon: CalendarRange },
      { href: "/admin/bookings/new", labelKey: "adminNavNewBooking", icon: PlusCircle },
    ],
  },
  {
    titleKey: "adminGroupContent",
    items: [
      { href: "/admin/tours", labelKey: "adminNavTours", icon: MapPin },
      { href: "/admin/tours/categories", labelKey: "adminNavCategories", icon: FolderTree },
      { href: "/admin/tours/pricing", labelKey: "adminNavPricing", icon: DollarSign },
      { href: "/admin/availability", labelKey: "adminNavAvailability", icon: CalendarDays },
      { href: "/admin/reviews", labelKey: "adminNavReviews", icon: Star },
      { href: "/admin/journal", labelKey: "adminNavJournal", icon: BookOpen },
      { href: "/admin/media", labelKey: "adminNavMedia", icon: Image },
    ],
  },
  {
    titleKey: "adminGroupWebsite",
    items: [
      { href: "/admin/website/homepage", labelKey: "adminNavHomepage", icon: LayoutGrid },
      { href: "/admin/website/about", labelKey: "adminNavAbout", icon: FileText },
      { href: "/admin/website/contact", labelKey: "adminNavContact", icon: MessageSquare },
      { href: "/admin/website/footer", labelKey: "adminNavFooter", icon: BarChart3 },
      { href: "/admin/settings/social", labelKey: "adminNavSocial", icon: Share2 },
    ],
  },
  {
    titleKey: "adminGroupSettings",
    items: [
      { href: "/admin/settings", labelKey: "adminNavGeneral", icon: Settings },
      { href: "/admin/settings/booking", labelKey: "adminNavBookingSettings", icon: CalendarDays },
      { href: "/admin/settings/security", labelKey: "adminNavSecurity", icon: Lock },
    ],
  },
];

const flattened = navGroups.flatMap((g) => g.items);

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLang();
  const title = t("adminTitle").replace("{name}", business.name);
  const enActive = lang === "en";
  const swActive = lang === "sw";

  return (
    <div className="min-h-screen bg-stone-100">
      <BookingNotifier />
      <header className="bg-indigo-800 text-stone-100">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-display font-semibold">{title}</span>
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-0.5">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  enActive ? "bg-white text-indigo-800" : "text-stone-300 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("sw")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  swActive ? "bg-white text-indigo-800" : "text-stone-300 hover:text-white"
                }`}
              >
                SW
              </button>
            </div>
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="hidden xl:inline-flex items-center gap-1.5 text-stone-300 hover:text-stone-50"
            >
              {t("adminViewSite")} <ExternalLink size={14} />
            </Link>
            <form action={signOut}>
              <button className="inline-flex items-center gap-1.5 text-stone-300 hover:text-stone-50">
                <LogOut size={14} /> {t("adminSignOut")}
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-page flex gap-6 py-6 items-start">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-20">
          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.titleKey}>
                <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold px-2 mb-1">{t(group.titleKey)}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-stone-700 hover:bg-stone-200/70 hover:text-indigo-700 rounded-lg transition-colors"
                    >
                      <item.icon size={15} /> {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Mobile nav (chips) */}
          <div className="lg:hidden flex flex-wrap items-center gap-1.5 mb-4">
            {flattened.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <item.icon size={13} /> {t(item.labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  enActive ? "bg-indigo-700 text-white" : "text-stone-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("sw")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  swActive ? "bg-indigo-700 text-white" : "text-stone-600"
                }`}
              >
                SW
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
