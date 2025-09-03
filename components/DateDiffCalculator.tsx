"use client";

import React, { useMemo, useState } from "react";
import DateTimeField from "./DateTimeField";

function parseLocalDateTime(value: string): Date | null {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss = "0"] = timePart.split(":");
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  return isNaN(date.getTime()) ? null : date;
}

function formatHuman(days: number, hours: number, minutes: number, seconds: number) {
  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? "giorno" : "giorni"}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? "ora" : "ore"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "min" : "min"}`);
  if (seconds || parts.length === 0) parts.push(`${seconds} ${seconds === 1 ? "s" : "s"}`);
  return parts.join(", ").replace(/, ([^,]*)$/, " e $1");
}

export default function DateDiffCalculator() {
  const now = useMemo(() => new Date(), []);
  const toInputValue = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [startValue, setStartValue] = useState<string>(() => {
    const d = new Date(now);
    d.setHours(d.getHours() - 1);
    return toInputValue(d);
  });
  const [endValue, setEndValue] = useState<string>(() => toInputValue(now));

  const startDate = useMemo(() => parseLocalDateTime(startValue), [startValue]);
  const endDate = useMemo(() => parseLocalDateTime(endValue), [endValue]);

  const diff = useMemo(() => {
    if (!startDate || !endDate) return null;
    const ms = endDate.getTime() - startDate.getTime();
    const sign = Math.sign(ms) as -1 | 0 | 1;
    const absMs = Math.abs(ms);
    const totalSec = Math.floor(absMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const totalHours = +(absMs / (1000 * 60 * 60)).toFixed(3);
    const totalMinutes = +(absMs / (1000 * 60)).toFixed(3);
    const totalSeconds = +(absMs / 1000).toFixed(3);
    const human = formatHuman(days, hours, minutes, seconds);
    return { ms, sign, days, hours, minutes, seconds, totalHours, totalMinutes, totalSeconds, human };
  }, [startDate, endDate]);

  const statusLabel = !startDate || !endDate
    ? "Inserisci entrambe le date"
    : diff && diff.sign < 0
    ? "Fine precedente all'inizio"
    : diff && diff.sign > 0
    ? "Fine successiva all'inizio"
    : "Date uguali";

  const setNow = (which: "start" | "end") => {
    const v = toInputValue(new Date());
    if (which === "start") setStartValue(v);
    else setEndValue(v);
  };

  const swap = () => {
    setStartValue(endValue);
    setEndValue(startValue);
  };

  const clearAll = () => {
    setStartValue("");
    setEndValue("");
  };

  // Copia negli appunti
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  function buildClipboardText() {
    if (!diff || !startDate || !endDate) return "";
    const lines = [
      `Differenza tra ${startValue || "-"} e ${endValue || "-"}`,
      `Stato: ${statusLabel}`,
      `Scomposizione: ${diff.human}`,
      `Totali: ${diff.totalHours} ore | ${diff.totalMinutes} minuti | ${diff.totalSeconds} secondi`,
    ];
    return lines.join("\n");
  }
  function fallbackCopyText(text: string) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; // evita scroll
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      const selection = document.getSelection();
      const currentRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (currentRange && selection) {
        selection.removeAllRanges();
        selection.addRange(currentRange);
      }
      return ok;
    } catch {
      return false;
    }
  }
  async function handleCopy() {
    try {
      const text = buildClipboardText();
      if (!text) return;
      const canUseClipboard = typeof navigator !== "undefined" && !!navigator.clipboard?.writeText && (typeof window === "undefined" || window.isSecureContext !== false);
      if (canUseClipboard) {
        await navigator.clipboard.writeText(text);
        setCopyState("copied");
      } else {
        const ok = fallbackCopyText(text);
        setCopyState(ok ? "copied" : "error");
      }
      setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 1500);
    }
  }

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-black/10 dark:border-white/15 bg-gradient-to-b from-background/80 to-background/60 shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DateTimeField id="start" label="Inizio" value={startValue} onChangeAction={setStartValue} />
          <DateTimeField id="end" label="Fine" value={endValue} onChangeAction={setEndValue} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setNow("start")} className="px-3 py-1.5 text-sm rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Ora → Inizio</button>
          <button onClick={() => setNow("end")} className="px-3 py-1.5 text-sm rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Ora → Fine</button>
          <button onClick={swap} className="px-3 py-1.5 text-sm rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Scambia</button>
          <button onClick={clearAll} className="ml-auto px-3 py-1.5 text-sm rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5">Pulisci</button>
        </div>

        <div className="mt-6 rounded-xl bg-background/70 border border-black/10 dark:border-white/15 p-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-foreground/60">Stato</div>
              <div className="mt-1 text-sm font-medium">{statusLabel}</div>
            </div>
            {startDate && endDate && diff && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Copia risultato
                </button>
                <span aria-live="polite" className="text-xs text-foreground/60 min-w-14 text-right">
                  {copyState === "copied" ? "Copiato" : copyState === "error" ? "Errore" : ""}
                </span>
              </div>
            )}
          </div>

          {startDate && endDate && diff && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-black/10 dark:border-white/15 p-3">
                <div className="text-xs text-foreground/60">Scomposizione</div>
                <div className="mt-1 text-base font-semibold">{diff.human}</div>
              </div>
              <div className="rounded-lg border border-black/10 dark:border-white/15 p-3">
                <div className="text-xs text-foreground/60">Totali</div>
                <div className="mt-2 text-sm leading-6">
                  <div><span className="text-foreground/60">Ore: </span><span className="font-medium">{diff.totalHours}</span></div>
                  <div><span className="text-foreground/60">Minuti: </span><span className="font-medium">{diff.totalMinutes}</span></div>
                  <div><span className="text-foreground/60">Secondi: </span><span className="font-medium">{diff.totalSeconds}</span></div>
                </div>
              </div>
              <div className="rounded-lg border border-black/10 dark:border-white/15 p-3">
                <div className="text-xs text-foreground/60">Dettaglio</div>
                <div className="mt-2 text-sm leading-6">
                  <div><span className="text-foreground/60">Giorni: </span><span className="font-medium">{diff.days}</span></div>
                  <div><span className="text-foreground/60">Ore: </span><span className="font-medium">{diff.hours}</span></div>
                  <div><span className="text-foreground/60">Minuti: </span><span className="font-medium">{diff.minutes}</span></div>
                  <div><span className="text-foreground/60">Secondi: </span><span className="font-medium">{diff.seconds}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-foreground/60">
          Nota: il calcolo usa date locali; fusi orari e ora legale possono influenzare i risultati vicino ai cambi.
        </p>
      </div>
    </section>
  );
}
