"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none h-9 px-3";
    const styles =
      variant === "outline"
        ? "border border-black/10 dark:border-white/15 bg-background hover:bg-black/5 dark:hover:bg-white/5"
        : variant === "ghost"
        ? "hover:bg-black/5 dark:hover:bg-white/5"
        : "bg-foreground text-background hover:opacity-90";
    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";

