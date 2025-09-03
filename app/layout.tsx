import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { headers } from "next/headers";
import {I18nProvider} from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function detectLocaleFromHeaders(): Promise<"it" | "en"> {
  try {
    const h = await headers();
    const al = (h.get("accept-language") || "").toLowerCase();
    if (al.startsWith("it")) return "it";
    return "en";
  } catch {
    return "en";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocaleFromHeaders();
  if (locale === "it") {
    return {
      title: "Calcolatore differenza tra date",
      description:
        "Calcola facilmente la differenza di tempo tra due date (giorni, ore, minuti, secondi).",
    };
  }
  return {
    title: "Date difference calculator",
    description:
      "Easily calculate the time difference between two dates (days, hours, minutes, seconds).",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ssrLocale = await detectLocaleFromHeaders();
  return (
    <html lang={ssrLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <I18nProvider initialLocale={ssrLocale}>
                {children}
            </I18nProvider>
            <Toaster richColors closeButton position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
