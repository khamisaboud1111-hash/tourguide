"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  MapPin,
  CreditCard,
  BarChart2,
  Star,
  Image,
  FileText,
  Settings,
  Tag,
  Bell,
  Shield,
  Activity,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { business } from "@/lib/constants";
import { signOut } from "@/app/actions/auth";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Bookings",
    items: [
      { href: "/admin/bookings", label: "All Bookings", icon: Inbox },
      { href: "/admin/bookings/calendar", label: "Calendar", icon: Calendar },
      { href: "/admin/bookings/new", label: "New Booking", icon: Inbox },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/customers", label: "All Customers", icon: Users },
      { href: "/admin/customers/segments", label: "Segments", icon: Users },
    ],
  },
  {
    label: "Tours",
    items: [
      { href: "/admin/tours", label: "All Tours", icon: MapPin },
      { href: "/admin/tours/new", label: "Add Tour", icon: MapPin },
      { href: "/admin/tours/categories", label: "Categories", icon: Tag },
      { href: "/admin/tours/pricing", label: "Pricing", icon: CreditCard },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/availability", label: "Availability", icon: Calendar },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/journal", label: "Journal", icon: FileText },
      { href: "/admin/media", label: "Media Library", icon: Image },
      { href: "/admin/promotions", label: "Promotions", icon: Tag },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/website/homepage", label: "Homepage", icon: LayoutDashboard },
      { href: "/admin/website/about", label: "About", icon: FileText },
      { href: "/admin/website/contact", label: "Contact", icon: FileText },
      { href: "/admin/website/footer", label: "Footer", icon: FileText },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/business", label: "Business", icon: Settings },
      { href: "/admin/settings/booking", label: "Booking", icon: Calendar },
      { href: "/admin/settings/seo", label: "SEO", icon: Search },
      { href: "/admin/settings/social", label: "Social", icon: ExternalLink },
      { href: "/admin/settings/security", label: "Security", icon: Shield },
    ],
  },
  {
    label: "Team & Activity",
    items: [
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

function NavItem({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: LucideIcon; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors rounded-lg mx-3 ${
        isActive
          ? "bg-clove-50 text-clove-700 border-r-2 border-clove-600"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function NavSection({ label, items, pathname }: { label: string; items: { href: string; label: string; icon: LucideIcon }[]; pathname: string }) {
  return (
    <div className="mb-6">
      <p className="px-4 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wide">{label}</p>
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))}
        />
      ))}
    </div>
  );
}

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-display font-semibold text-clove-700">{business.name}</span>
              <span className="text-xs text-stone-400 uppercase tracking-wide">Admin</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
            <div className="px-3">
              {navSections.map((section) => (
                <NavSection
                  key={section.label}
                  label={section.label}
                  items={section.items}
                  pathname={pathname}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{business.name}</p>
                <p className="text-xs text-stone-500">Admin Panel</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 text-stone-600 hover:border-clove-300 hover:text-clove-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                <ExternalLink size={14} />
                View Site
              </Link>
              <form action={signOut}>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 text-stone-600 hover:border-clove-300 hover:text-clove-700 px-3 py-2 text-sm font-medium transition-colors">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}