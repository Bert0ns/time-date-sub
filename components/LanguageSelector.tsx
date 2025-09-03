"use client";

import React, { useMemo, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: "it" as const, label: t("lang.it") },
      { value: "en" as const, label: t("lang.en") },
    ],
    [t]
  );

  const current = options.find((o) => o.value === (locale as "it" | "en"));

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-foreground/70">{t("lang.label")}</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-label={t("lang.label")}
              aria-expanded={open}
              className="justify-between gap-2 rounded-full px-3 h-9"
           >
              <span className="inline-flex items-center gap-2">
                <Globe className="size-4 opacity-70" aria-hidden />
                <span className="text-sm">
                  {current?.label ?? t("lang.label")}
                </span>
              </span>
              <ChevronsUpDown className="ml-2 size-4 opacity-60" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-56" align="start">
            <Command>
              <CommandInput placeholder={t("lang.label") + "..."} />
              <CommandEmpty>{t("list.empty") ?? "No results."}</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => {
                        setLocale(opt.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          opt.value === locale ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
