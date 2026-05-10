"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type Locale, type Translations } from "./translations";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("asondo-locale") : null;
    if (stored === "fr" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("asondo-locale", next);
      document.documentElement.lang = next;
    }
  };

  const toggle = () => setLocale(locale === "fr" ? "en" : "fr");

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale, toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
