"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import { languages } from "@/lib/i18n/dictionary";

export default function LanguageSwitcher({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === lang) ?? languages[0];
  const isLight = variant === "light";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${isLight ? "border-white/20 bg-white/10 text-white hover:bg-white/15 backdrop-blur" : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"}`}
      >
        <Globe size={14} className={isLight ? "text-white" : "text-clove-600"} />
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""} ${isLight ? "text-white/70" : "text-stone-400"}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-[280px] md:w-[320px] rounded-2xl bg-white border border-stone-200 shadow-floating overflow-hidden z-50 animate-scale-in max-h-[70vh] flex flex-col"
        >
          <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/70">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-stone-500">Choose language</p>
            <p className="text-xs text-stone-400">Shows with flag — instantly</p>
          </div>
          <div className="grid grid-cols-2 gap-0 overflow-y-auto no-scrollbar">
            {languages.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  role="menuitem"
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 ${active ? "bg-clove-50" : ""}`}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium leading-none ${active ? "text-clove-700" : "text-stone-900"}`}>{l.native}</span>
                    <span className="block text-xs text-stone-500 leading-none mt-1">{l.label}</span>
                  </span>
                  {active && <Check size={14} className="text-clove-600 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 text-center">
            More languages coming — English is complete, others translate navigation & hero first.
          </div>
        </div>
      )}
    </div>
  );
}
