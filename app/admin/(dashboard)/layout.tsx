import Link from "next/link";
import { LayoutDashboard, MapPin, Inbox, LogOut, ExternalLink, Users, CalendarDays } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { business } from "@/lib/constants";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Inbox },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
  { href: "/admin/tours", label: "Tours", icon: MapPin },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-indigo-800 text-stone-100">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-display font-semibold">{business.name} — Admin</span>
          <div className="flex items-center gap-5 text-sm">
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
        <nav className="container-page flex gap-1 -mb-px">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-3 text-sm text-stone-200 hover:text-stone-50 hover:bg-indigo-700/60 rounded-t-lg transition-colors"
            >
              <item.icon size={15} /> {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
