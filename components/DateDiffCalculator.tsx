"use client";

import React, { useMemo, useState } from "react";
import DateTimeField from "./DateTimeField";
import Toast from "./Toast";
import { useI18n } from "./I18nProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

function parseLocalDateTime(value: string): Date | null {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss = "0"] = timePart.split(":");
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  return isNaN(date.getTime()) ? null : date;
}

export default function DateDiffCalculator() {
  const { t, locale } = useI18n();

  const unit = (what: "day" | "hour" | "minute" | "second", n: number) =>
    t(`units.${what}.${Math.abs(n) === 1 ? "one" : "other"}`);

  const formatHuman = (days: number, hours: number, minutes: number, seconds: number) => {
    const parts: string[] = [];
    if (days) parts.push(`${days} ${unit("day", days)}`);
    if (hours) parts.push(`${hours} ${unit("hour", hours)}`);
    if (minutes) parts.push(`${minutes} ${unit("minute", minutes)}`);
    if (seconds || parts.length === 0) parts.push(`${seconds} ${unit("second", seconds)}`);
    if (parts.length === 1) return parts[0];
    const and = t("list.and");
    return `${parts.slice(0, -1).join(", ")}${and}${parts[parts.length - 1]}`;
  };

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
  }, [startDate, endDate, locale]);

  const statusLabel = !startDate || !endDate
    ? t("status.enterBoth")
    : diff && diff.sign < 0
    ? t("status.endBefore")
    : diff && diff.sign > 0
    ? t("status.endAfter")
    : t("status.equal");

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

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  // Copia negli appunti (centralizzato)
  function fallbackCopyText(text: string) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
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

  async function copyText(text: string, successMsgKey: string) {
    try {
      if (!text) return;
      const canUseClipboard = typeof navigator !== "undefined" && !!navigator.clipboard?.writeText && (typeof window === "undefined" || window.isSecureContext);
      if (canUseClipboard) await navigator.clipboard.writeText(text);
      else if (!fallbackCopyText(text)) throw new Error("fallback failed");
      setToastType("success");
      setToastMsg(t(successMsgKey));
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 1600);
    } catch {
      setToastType("error");
      setToastMsg(t("toast.error"));
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 1800);
    }
  }

  function buildClipboardText() {
    if (!diff || !startDate || !endDate) return "";
    const headerTpl = t("copy.header");
    const header = headerTpl.replace("{start}", startValue || "-").replace("{end}", endValue || "-");
    const lines = [
      header,
      `${t("card.breakdown")}: ${diff.human}`,
      `${t("card.totals")}: ${diff.totalHours} ${t("totals.hours")} | ${diff.totalMinutes} ${t("totals.minutes")} | ${diff.totalSeconds} ${t("totals.seconds")}`,
    ];
    return lines.join("\n");
  }

  async function handleCopyAll() {
    const text = buildClipboardText();
    if (!text) return;
    await copyText(text, "toast.copyAll");
  }

  return (
    <section className="w-full max-w-3xl mx-auto">
      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DateTimeField id="start" label={t("field.start")} value={startValue} onChangeAction={setStartValue} />
          <DateTimeField id="end" label={t("field.end")} value={endValue} onChangeAction={setEndValue} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setNow("start")} variant="outline">{t("btn.nowStart")}</Button>
          <Button onClick={() => setNow("end")} variant="outline">{t("btn.nowEnd")}</Button>
          <Button onClick={swap} variant="outline">{t("btn.swap")}</Button>
          <Button onClick={clearAll} variant="outline" className="ml-auto">{t("btn.clear")}</Button>
        </div>

        <div className="mt-6 rounded-xl border border-black/10 dark:border-white/15 p-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-foreground/60">{t("status.label")}</div>
              <div className="mt-1 text-sm font-medium">{statusLabel}</div>
            </div>
            {startDate && endDate && diff && (
              <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleCopyAll} variant="outline" className="text-xs sm:text-sm h-8 px-3">
                  {t("btn.copyAll")}
                </Button>
              </div>
            )}
          </div>

          {startDate && endDate && diff && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Card>
                <CardTitle className="p-3">{t("card.breakdown")}</CardTitle>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold flex-1">{diff.human}</div>
                    <Button onClick={() => copyText(diff.human, "copy.breakdown")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.breakdown")} title={t("copy.breakdown")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="p-3">{t("card.totals")}</CardTitle>
                <CardContent className="text-sm leading-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("totals.hours")}: </span><span className="font-medium">{diff.totalHours}</span></div>
                    <Button onClick={() => copyText(`${diff.totalHours}`, "copy.totalHours")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.totalHours")} title={t("copy.totalHours")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("totals.minutes")}: </span><span className="font-medium">{diff.totalMinutes}</span></div>
                    <Button onClick={() => copyText(`${diff.totalMinutes}`, "copy.totalMinutes")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.totalMinutes")} title={t("copy.totalMinutes")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("totals.seconds")}: </span><span className="font-medium">{diff.totalSeconds}</span></div>
                    <Button onClick={() => copyText(`${diff.totalSeconds}`, "copy.totalSeconds")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.totalSeconds")} title={t("copy.totalSeconds")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="p-3">{t("card.detail")}</CardTitle>
                <CardContent className="text-sm leading-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("detail.days")}: </span><span className="font-medium">{diff.days}</span></div>
                    <Button onClick={() => copyText(`${diff.days}`, "copy.days")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.days")} title={t("copy.days")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("detail.hours")}: </span><span className="font-medium">{diff.hours}</span></div>
                    <Button onClick={() => copyText(`${diff.hours}`, "copy.hours")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.hours")} title={t("copy.hours")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("detail.minutes")}: </span><span className="font-medium">{diff.minutes}</span></div>
                    <Button onClick={() => copyText(`${diff.minutes}`, "copy.minutes")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.minutes")} title={t("copy.minutes")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-foreground/60">{t("detail.seconds")}: </span><span className="font-medium">{diff.seconds}</span></div>
                    <Button onClick={() => copyText(`${diff.seconds}`, "copy.seconds")} variant="ghost" className="h-8 w-8 p-1" aria-label={t("copy.seconds")} title={t("copy.seconds")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-foreground/60">{t("note")}</p>
      </Card>

      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </section>
  );
}
