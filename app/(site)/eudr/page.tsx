import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileSignature, UserCog } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { TrackRecordBanner } from "@/app/components/TrackRecordBanner";
import { EvidenceMatrix } from "@/app/sections/EvidenceMatrix";

export const metadata: Metadata = {
  title: "Conformité EUDR — Matrice de preuves Asondo",
  description:
    "Asondo et la conformité EUDR (Règlement UE 2023/1115) : matrice de preuves vérifiable des 4 piliers, Compliance Officer et Déclaration de Diligence Raisonnée (DDS). Cacao ivoirien tracé, sourcé après le 31/12/2020.",
  alternates: { canonical: "/eudr" },
  openGraph: {
    title: "Conformité EUDR — Asondo Cocoa Export",
    description:
      "Matrice de preuves EUDR vérifiable, Compliance Officer dédié, modèle de Déclaration de Diligence Raisonnée. Cacao ivoirien EUDR-aligned.",
    url: "https://asondo.ci/eudr",
  },
};

export default function EudrPage() {
  return (
    <main>
      <PageHero
        eyebrow="EUDR · Règlement UE 2023/1115"
        title="Notre conformité EUDR, en clair."
        subtitle="Asondo aligne sa chaîne d'approvisionnement avec les exigences du Règlement européen sur la déforestation. Cette page rassemble nos preuves publiques, l'identité de notre Compliance Officer, et le modèle de Déclaration de Diligence Raisonnée (DDS) que nous soumettons à chaque expédition."
        breadcrumbs={[{ label: "Conformité EUDR" }]}
        cta={
          <>
            <Link
              href="/eudr/compliance-officer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
            >
              <UserCog className="w-4 h-4" />
              Voir le Compliance Officer
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eudr/due-diligence-statement"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
            >
              <FileSignature className="w-4 h-4" />
              Modèle de DDS
            </Link>
          </>
        }
      />

      {/* Evidence matrix — main signal */}
      <EvidenceMatrix />

      {/* Honest, real-time status of the EUDR ramp-up */}
      <TrackRecordBanner />

      {/* Quick links to deep pages */}
      <section className="py-16 sm:py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <Link
              href="/eudr/compliance-officer"
              className="group card-premium p-7 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF3E7] border border-[#E8833D]/30 flex items-center justify-center mb-4">
                <UserCog className="w-6 h-6 text-[#D06B1F]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                Responsable Conformité EUDR
              </h3>
              <p className="text-sm text-[#4B5563] mb-4 leading-relaxed">
                Identité, missions, contact et procédure de remontée
                d’alerte (whistleblowing) du Compliance Officer EUDR Asondo.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#D06B1F]">
                Voir la page
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/eudr/due-diligence-statement"
              className="group card-premium p-7 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF3E7] border border-[#E8833D]/30 flex items-center justify-center mb-4">
                <FileSignature className="w-6 h-6 text-[#D06B1F]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                Modèle de DDS Asondo
              </h3>
              <p className="text-sm text-[#4B5563] mb-4 leading-relaxed">
                Modèle public de notre Déclaration de Diligence Raisonnée
                soumise à l’EUDR Information System pour chaque expédition.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#D06B1F]">
                Voir le modèle
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="group card-premium p-7 rounded-2xl md:col-span-2 border-[#1F3D2F]/15 hover:border-[#1F3D2F]/30"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#1F3D2F]/10 border border-[#1F3D2F]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#1F3D2F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Demander le Buyer Pack complet
                  </h3>
                  <p className="text-sm text-[#4B5563] mb-4 leading-relaxed">
                    Acheteurs vérifiés : recevez le Buyer Pack complet sous
                    NDA — polygones GPS détaillés, audits, attestations,
                    numéros de référence DDS pour chaque expédition.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1F3D2F]">
                    Demander un accès
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
