"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dictionary, languages, t, type Lang } from "./dictionary";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function useLang() {
  return useContext(I18nCtx);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && languages.some((l) => l.code === saved)) setLangState(saved);
    else {
      const nav = navigator.language.slice(0, 2) as Lang;
      if (languages.some((l) => l.code === nav)) setLangState(nav);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
    // Force server components to re-render with new lang
    router.refresh();
    // Fallback hard reload if router.refresh doesn't pick new cookie quickly
    setTimeout(() => window.location.reload(), 150);
  };

  const tt = (key: string) => t(lang, key);

  return <I18nCtx.Provider value={{ lang, setLang, t: tt }}>{children}</I18nCtx.Provider>;
}
