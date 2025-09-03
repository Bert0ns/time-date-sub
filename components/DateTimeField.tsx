"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
      <Label htmlFor={id} className="mb-1 block">
        {label}
      </Label>
      <Input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
      />
    </div>
  );
}
