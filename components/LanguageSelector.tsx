"use client";

import React from "react";
import { useI18n } from "./I18nProvider";

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className={className}>
      <label className="sr-only" htmlFor="lang-select">{t("lang.label")}</label>
      <select
        id="lang-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="rounded-lg border border-black/10 dark:border-white/15 bg-background/80 px-3 py-1.5 text-sm"
        aria-label={t("lang.label")}
      >
        <option value="it">{t("lang.it")}</option>
        <option value="en">{t("lang.en")}</option>
      </select>
    </div>
  );
}

