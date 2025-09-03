"use client";

import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    const base = "text-sm font-medium text-foreground/80";
    return <label ref={ref} className={`${base} ${className}`} {...props} />;
  }
);
Label.displayName = "Label";

