"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, User, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { business } from "@/lib/constants";
import { signOut } from "@/app/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="container-page flex items-center justify-between h-16">
        {/* Mobile menu button — opens the left sidebar drawer */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Page title */}
        <div className="flex-1 lg:flex-none text-center lg:text-left">
          <h1 className="font-display text-lg font-semibold text-stone-900">{pageTitle}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme switch */}
          <div className="hidden sm:flex mr-1">
            <ThemeToggle />
          </div>

          {/* Global search */}
          <div className="relative hidden md:block" data-dropdown>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
              aria-label="Global search"
            >
              <Search size={18} />
              <span className="text-sm">Search...</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-80">
                <div className="rounded-xl bg-white border border-stone-200 shadow-lg p-3">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings, customers, tours..."
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-clove-500"
                  />
                  <p className="mt-2 text-xs text-stone-500">Search bookings, customers, tours...</p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-clove-600 text-white text-[10px] font-medium">
                3
              </span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80">
                <div className="rounded-xl bg-white border border-stone-200 shadow-lg">
                  <div className="p-3 border-b border-stone-200 flex items-center justify-between">
                    <p className="font-medium text-stone-900">Notifications</p>
                    <button className="text-xs text-clove-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { type: "booking", title: "New booking request", time: "2 min ago", read: false },
                      { type: "payment", title: "Payment received", time: "15 min ago", read: false },
                      { type: "review", title: "New review awaiting moderation", time: "1 hour ago", read: true },
                    ].map((n, i) => (
                      <button key={i} className={`w-full p-3 text-left hover:bg-stone-50 ${!n.read ? "bg-clove-50/50" : ""}`}>
                        <p className={`text-sm ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{n.time}</p>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-stone-200">
                    <Link href="/admin/notifications" className="text-sm text-clove-600 hover:underline block text-center">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-clove-100 flex items-center justify-center">
                <User size={18} className="text-clove-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-stone-700">Admin</span>
              <ChevronDown size={16} className="text-stone-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48">
                <div className="rounded-xl bg-white border border-stone-200 shadow-lg py-1">
                  <div className="px-3 py-2 border-b border-stone-200">
                    <p className="text-sm font-medium text-stone-900">Administrator</p>
                    <p className="text-xs text-stone-500">Full access</p>
                  </div>
                  <Link href="/admin/settings/business" className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50">Settings</Link>
                  <Link href="/" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                    <ExternalLink size={14} />
                    View website
                  </Link>
                  <hr className="my-1 border-stone-200" />
                  <form action={signOut}>
                    <button className="w-full text-left px-3 py-2 text-sm text-clove-600 hover:bg-stone-50 flex items-center gap-2">
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}