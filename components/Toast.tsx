"use client";

import React from "react";

export type ToastProps = {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export default function Toast({ open, message, type = "info", onClose }: ToastProps) {
  const base = "fixed inset-x-0 bottom-6 flex justify-center px-4 pointer-events-none";
  const box = `pointer-events-auto rounded-xl border shadow-lg px-4 py-2 text-sm sm:text-base bg-background/95 backdrop-blur transition-all duration-200 ${
    type === "success"
      ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
      : type === "error"
      ? "border-rose-500/30 text-rose-700 dark:text-rose-300"
      : "border-black/10 dark:border-white/15 text-foreground"
  } ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`;

  return (
    <div className={base} role="status" aria-live="polite">
      <div className={box}>
        <div className="flex items-center gap-2">
          {type === "success" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          {type === "error" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 rounded-md px-2 py-1 text-xs border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Chiudi avviso"
            >
              Chiudi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

