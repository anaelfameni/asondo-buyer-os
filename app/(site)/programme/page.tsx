import type { Metadata } from "next";
import { ProgrammeDashboard } from "@/app/sections/ProgrammeDashboard";
import { ProgrammeHero } from "./_components/ProgrammeHero";

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
      {/* Localised hero — picks fr/en based on user toggle */}
      <ProgrammeHero />

      <ProgrammeDashboard />
    </main>
  );
}
