"use client";

import Link from "next/link";
import { ArrowRight, FileSignature, UserCog } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { useI18n } from "@/lib/i18n-context";

/**
 * Localised hero band for `/eudr`. Extracted as a client component so the
 * surrounding server page can still export `metadata` while the hero text
 * + CTAs respond to the user's locale switch.
 */
export function EudrHero() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <PageHero
      bgImage="/photo1.jpg"
      eyebrow={fr ? "EUDR · Règlement UE 2023/1115" : "EUDR · EU Regulation 2023/1115"}
      title={
        fr
          ? "Notre conformité EUDR, en clair."
          : "Our EUDR compliance, made clear."
      }
      subtitle={
        fr
          ? "Asondo aligne sa chaîne d'approvisionnement avec les exigences du Règlement européen sur la déforestation. Cette page rassemble nos preuves publiques, l'identité de notre Compliance Officer, et le modèle de Déclaration de Diligence Raisonnée (DDS) que nous soumettons à chaque expédition."
          : "Asondo aligns its supply chain with the European deforestation regulation. This page gathers our public evidence, our Compliance Officer's identity, and the Due Diligence Statement (DDS) template we submit for each shipment."
      }
      breadcrumbs={[{ label: fr ? "Conformité EUDR" : "EUDR Compliance" }]}
      cta={
        <>
          <Link
            href="/eudr/compliance-officer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
          >
            <UserCog className="w-4 h-4" />
            {fr ? "Voir le Compliance Officer" : "Meet the Compliance Officer"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/eudr/due-diligence-statement"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
          >
            <FileSignature className="w-4 h-4" />
            {fr ? "Modèle de DDS" : "DDS template"}
          </Link>
        </>
      }
    />
  );
}
