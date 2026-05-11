"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Shared chrome for legal / EUDR-deep content pages.
 *
 * Renders the same Ivorian-cocoa photograph + green-to-orange overlay as
 * the home `HeroBanner` and the `PageHero` used by `/eudr`, `/programme`,
 * `/reseau`, `/equipe`, `/contact`. This is intentional: any page a
 * potential buyer lands on should immediately read as "part of Asondo".
 *
 * Additional chrome on top of `PageHero` (kept here because legal pages
 * have specific needs):
 *   - "Back to home" link at the very top of the hero
 *   - "Last updated" date displayed under the title
 *   - Prose container with `legal-prose` typography for the body
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
      {/* Hero band — visually aligned with the home HeroBanner and
          PageHero so all dedicated pages share the same orange identity. */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        {/* Same Ivorian-cocoa photograph as the home hero and PageHero.
            `priority` + `fetchPriority="high"` so it loads with the LCP. */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/backgroundhero.jpg"
            alt=""
            fill
            priority
            quality={80}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Same green-to-orange overlay gradient as the home hero. */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#1F3D2F]/85 via-[#D06B1F]/65 to-[#E8833D]/50 pointer-events-none" />

        {/* Bottom fade into the page's cream body. */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #FDFBF7 0%, rgba(253,251,247,0.35) 12%, transparent 30%, transparent 100%)",
          }}
        />

        {/* Subtle decorative orbs, kept smaller than home hero. */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-[#F4A866]/25 blur-[90px] z-10 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-[360px] h-[360px] rounded-full bg-[#F2B83E]/20 blur-[100px] z-10 pointer-events-none"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "fr" ? "Retour à l'accueil" : "Back to home"}
          </Link>

          {eyebrow ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-xs font-semibold text-white uppercase tracking-wider mb-4 shadow-lg shadow-black/10">
              <FileText className="w-3.5 h-3.5" />
              {eyebrow}
            </div>
          ) : null}

          <h1
            className="text-headline font-bold text-white mb-4 max-w-3xl text-balance"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.25)" }}
          >
            {title}
          </h1>

          {subtitle ? (
            <p
              className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed text-pretty"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.2)" }}
            >
              {subtitle}
            </p>
          ) : null}

          {lastUpdated ? (
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">
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
