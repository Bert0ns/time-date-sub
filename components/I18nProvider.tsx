"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DICTS, Locale } from "@/lib/text-languages";

type I18nContextType = {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: "it" | "en" }) {
  const [locale, setLocale] = useState<"it" | "en">(initialLocale ?? "en");

  // rileva lingua utente o carica preferenza salvata
  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale") as ("it" | "en") | null;
      if (saved === "it" || saved === "en") {
        setLocale(saved);
        return;
      }
    } catch {}
    // se esiste initialLocale, mantienilo; altrimenti usa navigator
    if (initialLocale) return;
    try {
      const nav = navigator?.language || "en";
      const loc: "it" | "en" = nav.toLowerCase().startsWith("it") ? "it" : "en";
      setLocale(loc);
    } catch {
      setLocale("en");
    }
  }, [initialLocale]);

  // aggiorna l'attributo lang del documento
  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.documentElement.lang = locale;
      }
    } catch {}
  }, [locale]);

  const value = useMemo<I18nContextType>(() => ({
    locale,
    setLocale: (loc) => {
      setLocale(loc);
      try { localStorage.setItem("locale", loc); } catch {}
    },
    t: (key: string) => DICTS[locale][key] ?? key,
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
