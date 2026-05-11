import type { Metadata } from "next";
import { SupplyMap } from "@/app/sections/SupplyMap";
import { ReseauHero } from "./_components/ReseauHero";

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
      {/* Localised hero — picks fr/en based on user toggle */}
      <ReseauHero />

      <SupplyMap />
    </main>
  );
}
