"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Shared chrome for legal / EUDR / team / programme content pages.
 *
 * Renders a top breadcrumb, a hero band consistent with the orange
 * Asondo identity, a prose container with sensible typography, and a
 * “last updated” footer note. The actual page-specific content lives
 * in `children`.
 */
export function LegalShell({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Free-form string already localised by the caller. */
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  const { locale } = useI18n();

  return (
    <div className="bg-[#FDFBF7]">
      {/* Hero band */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-gradient-to-br from-[#FEF3E7] via-[#FDFBF7] to-[#F4A866]/40 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#E8833D]/15 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#1F3D2F]/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#1F3D2F] hover:text-[#D06B1F] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "fr" ? "Retour à l'accueil" : "Back to home"}
          </Link>

          {eyebrow ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#E8833D]/30 text-xs font-semibold text-[#D06B1F] uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5" />
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

          {lastUpdated ? (
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#6B7280] font-semibold">
              {locale === "fr" ? "Dernière mise à jour" : "Last updated"} ·{" "}
              {lastUpdated}
            </p>
          ) : null}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto legal-prose">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Helper to render placeholder values that still need to be filled
 * by the Asondo team. The visual styling makes them impossible to
 * miss in production.
 */
export function PlaceholderValue({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FEF3E7] border border-dashed border-[#E8833D] text-[#A85318] text-sm font-mono">
      {children}
    </span>
  );
}
