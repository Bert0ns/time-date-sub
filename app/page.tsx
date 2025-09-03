"use client";

import {useI18n} from "@/components/I18nProvider";
import LanguageSelector from "@/components/LanguageSelector";
import DateDiffCalculator from "@/components/DateDiffCalculator";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-10">
      <header className="w-full max-w-3xl flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-0 sm:justify-between text-center sm:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {t("app.title")}
          </h1>
          <p className="mt-2 text-sm text-foreground/70">{t("app.subtitle")}</p>
        </div>
        <LanguageSelector className="self-center sm:self-auto" />
      </header>

      <main className="w-full mt-6 sm:mt-8">
        <DateDiffCalculator />
      </main>

      <footer className="w-full max-w-3xl mt-10 text-center text-xs text-foreground/60">
        {t("footer.note")}
      </footer>
    </div>
  );
}
