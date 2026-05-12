"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Ship,
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";

/**
 * Homepage-only teaser for the RFQ flow.
 *
 * The full RFQ form lives exclusively on `/contact` so the homepage stays
 * focused on positioning and proof. This teaser keeps the existing
 * "Demande de devis · Réponse < 24h" promise visible on the home page
 * (so buyers don't lose the signal that a quote is one click away),
 * then routes them to `/contact` where the actual form is rendered.
 *
 * The bullet points below are an expansion of `t.rfq.subtitle` —
 * grounded strictly on facts already published elsewhere on the site
 * (FOB Abidjan / CIF Rotterdam-Hamburg-Antwerp from `asondoData.services`,
 * the 24h response promise from `t.rfq.badge`, and the EUDR-aligned
 * compliance from the Evidence Matrix).
 */
export function HomeRFQTeaser() {
  const { t, locale } = useI18n();
  const fr = locale === "fr";

  const bullets = fr
    ? [
        {
          icon: Ship,
          label: "Volumes & livraison",
          text: "FOB Abidjan ou CIF Rotterdam / Hamburg / Antwerp, du conteneur d'échantillonnage au lot saisonnier.",
        },
        {
          icon: ShieldCheck,
          label: "Conformité EUDR-aligned",
          text: "Cacao tracé, sourcé après le 31/12/2020, polygones GPS disponibles sous NDA pour vos équipes due-diligence.",
        },
        {
          icon: Globe2,
          label: "Spécifications qualité",
          text: "Fermentation, humidité < 7,5 %, brisures, certifications complémentaires (Rainforest Alliance, bio) sur demande.",
        },
        {
          icon: Clock,
          label: "Réponse sous 24 h ouvrées",
          text: "Notre équipe à Abidjan vous prépare une offre indicative avec prix, calendrier et exigences documentaires.",
        },
      ]
    : [
        {
          icon: Ship,
          label: "Volumes & shipping",
          text: "FOB Abidjan or CIF Rotterdam / Hamburg / Antwerp, from a sampling container up to seasonal lots.",
        },
        {
          icon: ShieldCheck,
          label: "EUDR-aligned compliance",
          text: "Traceable cocoa sourced after 31 Dec 2020, with GPS polygons disclosed under NDA to your due-diligence teams.",
        },
        {
          icon: Globe2,
          label: "Quality specifications",
          text: "Fermentation, humidity < 7.5%, broken beans, additional certifications (Rainforest Alliance, organic) on request.",
        },
        {
          icon: Clock,
          label: "Response within 24 business hours",
          text: "Our Abidjan team prepares an indicative offer with pricing, schedule and documentation requirements.",
        },
      ];

  const ctaLabel = fr ? "Demander un devis" : "Request a quote";
  const introTitle = fr
    ? "Précisez votre besoin."
    : "Tell us your requirements.";
  const introSummary = fr
    ? "Notre équipe à Abidjan vous prépare une offre personnalisée sous 24 heures ouvrées, alignée sur les exigences EUDR, vos volumes cibles et votre port de destination."
    : "Our Abidjan team prepares a tailored offer within 24 business hours, aligned with EUDR requirements, your target volumes and destination port.";

  return (
    <section
      id="rfq-form"
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#FEF3E7] via-[#FDFBF7] to-[#F4A866]/20"
    >
      {/* Decorative orbs — mirror the visual identity of the original form section. */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#F4A866]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F2B83E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white text-sm font-semibold mb-6 shadow-lg shadow-[#E8833D]/25">
              <Clock className="w-4 h-4" />
              {t.rfq.badge}
            </div>
            <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
              {t.rfq.title}
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed text-pretty">
              <span className="font-semibold text-[#1A1A1A]">{introTitle}</span>{" "}
              {introSummary}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E8833D]/20 via-[#F2B83E]/20 to-[#D06B1F]/20 rounded-3xl blur-2xl opacity-70" />

              <div className="relative bg-white rounded-3xl border border-[#E8833D]/15 shadow-2xl shadow-[#E8833D]/10 p-8 sm:p-10">
                <ul className="grid sm:grid-cols-2 gap-5 mb-8">
                  {bullets.map(({ icon: Icon, label, text }) => (
                    <li
                      key={label}
                      className="flex items-start gap-3 rounded-2xl border border-[#E8833D]/10 bg-[#FDFBF7] p-4"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shadow-md shadow-[#E8833D]/25">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1A1A1A] mb-1">
                          {label}
                        </div>
                        <p className="text-sm text-[#4B5563] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#E8833D]/15 pt-6">
                  <p className="flex items-center gap-2 text-sm text-[#4B5563]">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    {fr
                      ? "Aucun engagement — un échange exploratoire pour cadrer votre besoin."
                      : "No commitment — an exploratory call to scope your needs."}
                  </p>

                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white font-semibold text-sm hover:from-[#D06B1F] hover:to-[#A85318] transition-all shadow-lg shadow-[#D06B1F]/25 btn-premium whitespace-nowrap"
                  >
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
