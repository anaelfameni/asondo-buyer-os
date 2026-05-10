"use client";

import { useI18n } from "@/lib/i18n-context";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/translations";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { locale, setLocale } = useI18n();
  const isLight = variant === "light";

  /**
   * Switch language while preserving the user's scroll position.
   * React re-renders the whole tree synchronously after `setLocale`, but
   * because the page height may change slightly between FR and EN, the
   * browser can momentarily snap the viewport. We freeze scroll before
   * the state update and restore it on the next two frames to outlast
   * Framer Motion's first paint.
   */
  const handleSwitch = (
    e: React.MouseEvent<HTMLButtonElement>,
    next: Locale,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (locale === next) return;

    if (typeof window !== "undefined") {
      const prevX = window.scrollX;
      const prevY = window.scrollY;
      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      setLocale(next);

      const restore = () => window.scrollTo(prevX, prevY);
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(() => {
          restore();
          document.documentElement.style.scrollBehavior = prevBehavior;
        });
      });
    } else {
      setLocale(next);
    }

    // Remove focus so subsequent clicks elsewhere don't bubble through
    e.currentTarget.blur();
  };

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border px-1 py-0.5 ${
        isLight ? "border-white/30 bg-white/10 backdrop-blur-md" : "border-[#E8833D]/20 bg-white"
      }`}
    >
      <Globe className={`w-3.5 h-3.5 ml-1.5 ${isLight ? "text-white" : "text-[#D06B1F]"}`} />
      <button
        type="button"
        onClick={(e) => handleSwitch(e, "fr")}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
          locale === "fr"
            ? "bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white shadow-md"
            : isLight
              ? "text-white/80 hover:text-white"
              : "text-[#6B7280] hover:text-[#D06B1F]"
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <button
        type="button"
        onClick={(e) => handleSwitch(e, "en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
          locale === "en"
            ? "bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white shadow-md"
            : isLight
              ? "text-white/80 hover:text-white"
              : "text-[#6B7280] hover:text-[#D06B1F]"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
