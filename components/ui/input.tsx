"use client";

import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const base =
      "flex h-9 w-full rounded-md border border-black/10 dark:border-white/15 bg-background/60 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20";
    return <input ref={ref} className={`${base} ${className}`} {...props} />;
  }
);
Input.displayName = "Input";

