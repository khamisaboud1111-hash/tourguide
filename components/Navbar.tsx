"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, ArrowRight } from "lucide-react";
import { business, waLink } from "@/lib/constants";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "@/lib/i18n/context";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Premium nav — order: Experiences, Explore Zanzibar, Travel Journal, About Us, Gallery, Contact | CTA: Book Your Experience
  const links = [
    { href: "/tours", label: t("experiences") },
    { href: "/map", label: "Explore Zanzibar" },
    { href: "/journal", label: "Travel Journal" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: t("gallery") },
    { href: "/contact", label: t("contact") },
  ];

  // Scroll detection — compact + solid after ~32px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock + Escape + focus trap affordance
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // simple focus trap: cycle within menu
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const headerBg = isHome && !scrolled && !open
    ? "bg-transparent border-transparent"
    : "bg-stone-50/95 backdrop-blur-xl border-stone-200 shadow-soft";

  const linkColor = isHome && !scrolled && !open
    ? "text-stone-100/90 hover:text-white"
    : "text-stone-700 hover:text-clove-600";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-clove-600 focus:px-5 focus:py-2.5 focus:text-stone-50 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ease-ui ${headerBg}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className={`container-page flex items-center justify-between transition-all duration-300 ${scrolled ? "h-[64px] py-2" : "h-[72px] py-3"}`}>
          <Logo variant={isHome && !scrolled && !open ? "light" : "dark"} size="md" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-body text-[0.9375rem]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`${linkColor} transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${pathname === l.href ? "after:w-full" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher variant={isHome && !scrolled ? "light" : "dark"} />
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-2.5 text-sm font-semibold tracking-wide shadow-floating hover:bg-clove-700 hover:shadow-card-hover hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              Book Your Experience <ArrowRight size={16} />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher variant={isHome && !scrolled && !open ? "light" : "dark"} />
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isHome && !scrolled && !open ? "border-stone-50/25 text-stone-50 hover:bg-stone-50/10" : "border-stone-200 text-stone-800 hover:bg-stone-100"}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop compact underline when scrolled? handled via shadow */}
      </header>

      {/* Mobile full-screen menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 right-0 z-50 w-[82%] max-w-sm flex flex-col bg-stone-50 shadow-floating md:hidden animate-slide-in-right"
            style={{ animation: "slideInRight 0.25s ease-out" }}
          >
          <div className="container-page flex h-[72px] items-center justify-between border-b border-stone-200" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <span onClick={() => setOpen(false)} className="inline-flex">
              <Logo variant="dark" size="sm" href="/" />
            </span>
            <button
              ref={closeBtnRef}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-800 hover:bg-stone-100"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="container-page flex-1 py-8 flex flex-col gap-1 overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-display text-3xl font-medium tracking-tight py-3 border-b border-stone-100 last:border-0 transition-colors ${pathname === l.href ? "text-clove-600" : "text-stone-900 hover:text-clove-600"}`}
              >
                <span className="inline-flex items-center gap-3">
                  {l.label}
                  <ArrowRight size={18} className="opacity-40" />
                </span>
              </Link>
            ))}

            <div className="mt-4 flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher variant="dark" />
            </div>

            <div className="mt-8 grid gap-3">
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-4 text-[0.9375rem] font-semibold tracking-wide shadow-floating hover:bg-clove-700 transition-colors"
              >
                Book Your Experience <ArrowRight size={18} />
              </Link>
              <a
                href={waLink(`Hi ${business.guideName}, I'd like to ask about a tour.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-4 text-[0.9375rem] font-medium text-stone-800 hover:border-clove-300 hover:text-clove-700 transition-colors"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>

            <div className="mt-auto pt-8 text-sm text-stone-500 space-y-1">
              <p className="font-medium text-stone-700">{business.location}</p>
              <p>{business.phoneDisplay} · {business.email}</p>
            </div>
          </nav>
        </div>
        </>
      )}
    </>
  );
}
