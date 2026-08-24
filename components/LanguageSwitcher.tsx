"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check, Search, X } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import { languages } from "@/lib/i18n/dictionary";

export default function LanguageSwitcher({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const current = languages.find((l) => l.code === lang) ?? languages[0];
  const isLight = variant === "light";

  const sorted = [...languages].sort((a, b) => a.label.localeCompare(b.label));
  const filtered = query.trim()
    ? sorted.filter((l) =>
        [l.label, l.native, l.code, l.flag].join(" ").toLowerCase().includes(query.toLowerCase())
      )
    : sorted;

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

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

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
        <img
          src={`https://flagcdn.com/w20/${current.country}.png`}
          srcSet={`https://flagcdn.com/w40/${current.country}.png 2x`}
          width={20}
          height={15}
          alt={current.flag}
          className="h-3.5 w-5 rounded-sm object-cover shadow-sm shrink-0"
          loading="lazy"
        />
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
            <p className="text-xs text-stone-400">A â†’ Z with flag â€” searchable</p>
          </div>
          <div className="px-3 py-2 border-b border-stone-100 bg-white">
            <label className="relative block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search languagesâ€¦"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-8 py-2 text-sm outline-none focus:border-clove-300 focus:ring-2 focus:ring-clove-100"
                aria-label="Search languages"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-0 overflow-y-auto no-scrollbar">
            {filtered.map((l) => {
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
                  <img
                    src={`https://flagcdn.com/w20/${l.country}.png`}
                    srcSet={`https://flagcdn.com/w40/${l.country}.png 2x`}
                    width={20}
                    height={15}
                    alt={l.flag}
                    className="h-4 w-6 rounded-sm object-cover shadow-sm shrink-0"
                    loading="lazy"
                  />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium leading-none ${active ? "text-clove-700" : "text-stone-900"}`}>{l.native}</span>
                    <span className="block text-xs text-stone-500 leading-none mt-1">{l.label}</span>
                  </span>
                  {active && <Check size={14} className="text-clove-600 shrink-0" />}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-stone-500">No languages match â€œ{query}â€.</p>
          )}
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 text-center">
            {filtered.length} languages Â· A â†’ Z with flag
          </div>
        </div>
      )}
    </div>
  );
}
