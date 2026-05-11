"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Compact hero band used at the top of dedicated content pages
 * (`/eudr`, `/programme`, `/reseau`, `/contact`, `/equipe`, etc.).
 * Visual identity is intentionally aligned with the home `HeroBanner`:
 * the same `/backgroundhero.jpg` photograph layered under the same
 * green-to-orange overlay gradient, so every dedicated page reads as
 * "part of Asondo" the moment a buyer lands on it.
 *
 * All foreground text is rendered on the dark orange overlay, so we
 * use white / white-alpha typography and a translucent eyebrow pill,
 * mirroring the home hero's chrome.
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
    <section className="relative pt-32 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Same Ivorian-cocoa photograph as the home hero. We don't
          parallax it here — page heroes are short bands, not full
          screens — but the visual identity stays unmistakable. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgroundhero.jpg"
          alt=""
          fill
          priority
          quality={80}
          className="object-cover object-center"
        />
      </div>

      {/* Same green-to-orange overlay gradient as the home hero,
          slightly denser so the dark cream text stays legible at
          this compact size. */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#1F3D2F]/85 via-[#D06B1F]/65 to-[#E8833D]/50 pointer-events-none" />

      {/* Bottom fade into the page's cream body so the hero never
          looks like a hard cut on its way to the content below. */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #FDFBF7 0%, rgba(253,251,247,0.35) 12%, transparent 30%, transparent 100%)",
        }}
      />

      {/* Subtle decorative orange orbs (kept smaller than home hero). */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-[#F4A866]/25 blur-[90px] z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[360px] h-[360px] rounded-full bg-[#F2B83E]/20 blur-[100px] z-10 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Breadcrumb */}
        <nav
          aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}
          className="flex items-center text-xs text-white/75 mb-6 flex-wrap gap-y-1"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-xs font-semibold text-white uppercase tracking-wider mb-4 shadow-lg shadow-black/10">
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

        {cta ? <div className="mt-8 flex flex-wrap gap-3">{cta}</div> : null}
      </div>
    </section>
  );
}
