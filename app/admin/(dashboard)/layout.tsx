import Link from "next/link";
import {
  LayoutDashboard, MapPin, Inbox, LogOut, ExternalLink, Users, CalendarDays,
  Star, BookOpen, Settings, Activity, LineChart, Image, Images, Bell, CreditCard,
  Tag, Megaphone, UsersRound, CalendarRange, PlusCircle, FolderTree, DollarSign,
  Lock, Search, Share2, Globe, MessageSquare, Phone, FileText, Radio, BarChart3,
  Wallet, UserPlus, LayoutGrid, PieChart,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { business } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Sales",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: Inbox },
      { href: "/admin/bookings/calendar", label: "Calendar", icon: CalendarRange },
      { href: "/admin/bookings/new", label: "New Booking", icon: PlusCircle },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/customers/segments", label: "Segments", icon: UsersRound },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/promotions", label: "Promotions", icon: Megaphone },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/tours", label: "Tours", icon: MapPin },
      { href: "/admin/tours/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/tours/pricing", label: "Pricing", icon: DollarSign },
      { href: "/admin/availability", label: "Availability", icon: CalendarDays },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/journal", label: "Journal", icon: BookOpen },
      { href: "/admin/media", label: "Media", icon: Image },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/website/homepage", label: "Homepage", icon: LayoutGrid },
      { href: "/admin/website/about", label: "About Page", icon: FileText },
      { href: "/admin/website/contact", label: "Contact Page", icon: MessageSquare },
      { href: "/admin/website/footer", label: "Footer", icon: BarChart3 },
      { href: "/admin/settings/social", label: "Social Links", icon: Share2 },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/settings", label: "General", icon: Settings },
      { href: "/admin/settings/booking", label: "Booking", icon: CalendarDays },
      { href: "/admin/settings/payments", label: "Payments", icon: Wallet },
      { href: "/admin/settings/security", label: "Security", icon: Lock },
      { href: "/admin/settings/seo", label: "SEO", icon: Search },
      { href: "/admin/team", label: "Team", icon: UserPlus },
    ],
  },
];

const flattened = navGroups.flatMap((g) => g.items);

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-indigo-800 text-stone-100">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-display font-semibold">{business.name} — Admin</span>
          <div className="flex items-center gap-4 text-sm">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-stone-300 hover:text-stone-50"
            >
              View site <ExternalLink size={14} />
            </Link>
            <form action={signOut}>
              <button className="inline-flex items-center gap-1.5 text-stone-300 hover:text-stone-50">
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-page flex gap-6 py-6 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold px-2 mb-1">{group.title}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-stone-700 hover:bg-stone-200/70 hover:text-indigo-700 rounded-lg transition-colors"
                    >
                      <item.icon size={15} /> {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full">
          <nav className="flex flex-wrap gap-1.5 mb-4">
            {flattened.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <item.icon size={13} /> {item.label}
              </Link>
            ))}
          </nav>
          <main className="w-full">{children}</main>
        </div>

        {/* Desktop content */}
        <main className="flex-1 min-w-0 hidden lg:block">{children}</main>
      </div>
    </div>
  );
}
