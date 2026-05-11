import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { RFQForm } from "@/app/sections/RFQForm";

export const metadata: Metadata = {
  title: "Contact & Demande de devis — Asondo",
  description:
    "Demandez un devis Asondo : précisez votre volume cible, port de destination et exigences qualité. Réponse de notre équipe sous 24h. Cacao ivoirien EUDR-aligned.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Demander un devis — Asondo Cocoa Export",
    description:
      "Réponse en moins de 24h. Volumes FOB Abidjan ou CIF Rotterdam / Hamburg / Antwerp.",
    url: "https://asondo.ci/contact",
  },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact · Réponse < 24h"
        title="Discutons cacao."
        subtitle="Précisez votre besoin (volume, port de destination, exigences qualité, calendrier). Notre équipe vous prépare une offre personnalisée et vous répond en moins de 24 heures ouvrées."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <RFQForm />
    </main>
  );
}
