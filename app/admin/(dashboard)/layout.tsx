"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MapPin, Inbox, LogOut, ExternalLink, CalendarDays,
  Star, BookOpen, Settings, Image, Bell,
  CalendarRange, PlusCircle, FolderTree, DollarSign,
  Lock, Share2, FileText, MessageSquare, BarChart3,
  LayoutGrid, Menu, X,
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

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = t("adminTitle").replace("{name}", business.name);
  const enActive = lang === "en";
  const swActive = lang === "sw";
  const closeDrawer = () => setDrawerOpen(false);
  const isActive = (href: string) => pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));

  return (
    <div className="min-h-screen bg-stone-100">
      <BookingNotifier />
      {/* Mobile left-sidebar drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 shrink-0">
          <span className="font-display font-semibold text-indigo-800 truncate">{business.name}</span>
          <button onClick={closeDrawer} className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div key={group.titleKey} className="mb-5 px-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold px-2 mb-1">{t(group.titleKey)}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive(item.href) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <item.icon size={16} /> {t(item.labelKey)}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-200 shrink-0">
          <form action={signOut}>
            <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 text-stone-600 px-3 py-2 text-sm font-medium">
              <LogOut size={14} /> {t("adminSignOut")}
            </button>
          </form>
        </div>
      </aside>
      <header className="bg-indigo-800 text-stone-100">
        <div className="container-page flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="font-display font-semibold">{title}</span>
          </div>
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
          {/* Mobile language switch (nav moved into the left drawer) */}
          <div className="lg:hidden flex items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5 w-fit mb-4">
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
          {children}
        </main>
      </div>
    </div>
  );
}
