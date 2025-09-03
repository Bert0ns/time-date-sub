"use client";

import React from "react";
import {useI18n} from "@/components/I18nProvider";


export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-foreground/70">{t("lang.label")}</span>
        <div className="relative inline-flex">
          {/* Icona globo */}
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 0 0 20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 0 20"></path>
            </svg>
          </span>
          {/* Select stilizzato */}
          <select
            id="lang-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="appearance-none rounded-full border border-black/10 dark:border-white/15 bg-background/80 backdrop-blur pl-9 pr-9 py-1.5 text-sm shadow-sm hover:shadow transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            aria-label={t("lang.label")}
            title={t("lang.label")}
          >
            <option value="it">{t("lang.it")}</option>
            <option value="en">{t("lang.en")}</option>
          </select>
          {/* Caret */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
