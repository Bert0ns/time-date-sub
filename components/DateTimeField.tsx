"use client";

import React from "react";

export type DateTimeFieldProps = {
  id: string;
  label: string;
  value: string;
  onChangeAction: (value: string) => void;
  className?: string;
};

export default function DateTimeField({ id, label, value, onChangeAction, className }: DateTimeFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground/80 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-background/60 backdrop-blur px-3 py-2 text-sm outline-none ring-2 ring-transparent focus:ring-black/10 dark:focus:ring-white/20 shadow-sm"
      />
    </div>
  );
}
