import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { SupplyMap } from "@/app/sections/SupplyMap";

export const metadata: Metadata = {
  title: "Réseau d'approvisionnement Asondo — Côte d'Ivoire",
  description:
    "Carte interactive du réseau d'approvisionnement Asondo en Côte d'Ivoire : siège à Abidjan, sourcing dans 3 bassins (Centre, Est, Ouest) avec un échantillon de polygone GPS de démonstration.",
  alternates: { canonical: "/reseau" },
  openGraph: {
    title: "Réseau d'approvisionnement — Asondo Cocoa",
    description:
      "Sourcing par coopératives sélectionnées dans 3 bassins ivoiriens. Polygone démo public, polygones complets sous NDA dans le Buyer Pack.",
    url: "https://asondo.ci/reseau",
  },
};

export default function ReseauPage() {
  return (
    <main>
      <PageHero
        eyebrow="Sourcing · Côte d'Ivoire"
        title="Notre réseau d'approvisionnement."
        subtitle="Siège à Abidjan, sourcing par coopératives soigneusement sélectionnées dans trois bassins cacaoyers. La carte ci-dessous expose les régions publiques ; les polygones GPS détaillés sont communiqués aux acheteurs vérifiés sous NDA."
        breadcrumbs={[{ label: "Réseau" }]}
        cta={
          <>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
            >
              <MapPin className="w-4 h-4" />
              Demander les polygones (NDA)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eudr"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
            >
              Voir la conformité EUDR
            </Link>
          </>
        }
      />

      <SupplyMap />
    </main>
  );
}
