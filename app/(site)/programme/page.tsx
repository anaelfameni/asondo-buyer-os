import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { ProgrammeDashboard } from "@/app/sections/ProgrammeDashboard";

export const metadata: Metadata = {
  title: "Le programme Asondo — 4 piliers de durabilité",
  description:
    "Le programme Asondo articule 4 piliers : traçabilité, restauration & conservation, résilience & profit, banque & inclusion. 21 engagements concrets en faveur des coopératives ivoiriennes.",
  alternates: { canonical: "/programme" },
  openGraph: {
    title: "Le programme Asondo — 4 piliers de durabilité",
    description:
      "Traçabilité, restauration, résilience, banque. 21 engagements concrets pour une filière cacao ivoirienne durable et compétitive.",
    url: "https://asondo.ci/programme",
  },
};

export default function ProgrammePage() {
  return (
    <main>
      <PageHero
        eyebrow="Programme · 4 piliers"
        title="Notre programme de durabilité, en quatre piliers."
        subtitle="Asondo n'investit pas dans des logos certifiants. Nous investissons dans des engagements opérables, mesurables, vérifiables. Voici la cartographie publique des 21 commitments qui structurent notre programme."
        breadcrumbs={[{ label: "Programme" }]}
        cta={
          <>
            <Link
              href="/eudr"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
            >
              <ShieldCheck className="w-4 h-4" />
              Voir l’alignement EUDR
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
            >
              Discuter avec l’équipe
            </Link>
          </>
        }
      />

      <ProgrammeDashboard />
    </main>
  );
}
