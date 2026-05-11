"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Compact hero band used at the top of dedicated content pages
 * (`/eudr`, `/programme`, `/reseau`, `/contact`, `/equipe`). Provides
 * a breadcrumb, eyebrow tag, headline and optional subtitle, and an
 * optional CTA bar at the bottom. Visual identity stays aligned with
 * the home hero (orange gradient, atmospheric orbs).
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  cta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Items rendered as `Home > … > current`. Last item should be the current page. */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  cta?: React.ReactNode;
}) {
  const { locale } = useI18n();

  return (
    <section className="relative pt-32 pb-14 sm:pt-36 sm:pb-20 bg-gradient-to-br from-[#FEF3E7] via-[#FDFBF7] to-[#F4A866]/40 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#E8833D]/15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#1F3D2F]/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav
          aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}
          className="flex items-center text-xs text-[#6B7280] mb-6 flex-wrap gap-y-1"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#D06B1F] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            {locale === "fr" ? "Accueil" : "Home"}
          </Link>
          {breadcrumbs?.map((crumb, i) => (
            <span key={i} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-60" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-[#D06B1F] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#1A1A1A] font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#E8833D]/30 text-xs font-semibold text-[#D06B1F] uppercase tracking-wider mb-4">
            {eyebrow}
          </div>
        ) : null}

        <h1 className="text-headline font-bold text-[#1A1A1A] mb-4 max-w-3xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        ) : null}

        {cta ? <div className="mt-8 flex flex-wrap gap-3">{cta}</div> : null}
      </div>
    </section>
  );
}
