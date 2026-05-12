"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { useI18n } from "@/lib/i18n-context";

export function ProgrammeHero() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <PageHero
      bgImage="/photo4.jpg"
      eyebrow={fr ? "Programme · 4 piliers" : "Programme · 4 pillars"}
      title={
        fr
          ? "Notre programme de durabilité, en quatre piliers."
          : "Our sustainability programme, in four pillars."
      }
      subtitle={
        fr
          ? "Asondo n'investit pas dans des logos certifiants. Nous investissons dans des engagements opérables, mesurables, vérifiables. Voici la cartographie publique des 21 commitments qui structurent notre programme."
          : "Asondo does not invest in certification logos. We invest in operable, measurable, verifiable commitments. Here is the public map of the 21 commitments that structure our programme."
      }
      breadcrumbs={[{ label: fr ? "Programme" : "Programme" }]}
      cta={
        <>
          <Link
            href="/eudr"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
          >
            <ShieldCheck className="w-4 h-4" />
            {fr ? "Voir l'alignement EUDR" : "See EUDR alignment"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
          >
            {fr ? "Discuter avec l'équipe" : "Talk to the team"}
          </Link>
        </>
      }
    />
  );
}
