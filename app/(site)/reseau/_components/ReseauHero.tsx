"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { useI18n } from "@/lib/i18n-context";

export function ReseauHero() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <PageHero
      bgImage="/photo5.jpg"
      // Anchor the photograph at the top so the cocoa farmer's full
      // upper body (head + shoulders) is visible above the motorbike,
      // instead of being cropped at neck level by the default centre
      // anchor.
      bgPosition="top"
      eyebrow={fr ? "Sourcing · Côte d'Ivoire" : "Sourcing · Côte d'Ivoire"}
      title={
        fr
          ? "Notre réseau d'approvisionnement."
          : "Our sourcing network."
      }
      subtitle={
        fr
          ? "Siège à Abidjan, sourcing par coopératives soigneusement sélectionnées dans trois bassins cacaoyers. La carte ci-dessous expose les régions publiques ; les polygones GPS détaillés sont communiqués aux acheteurs vérifiés sous NDA."
          : "Headquarters in Abidjan, sourcing through carefully selected cooperatives across three cocoa basins. The map below shows our public regions; detailed GPS polygons are disclosed to verified buyers under NDA."
      }
      breadcrumbs={[{ label: fr ? "Réseau" : "Network" }]}
      cta={
        <>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
          >
            <MapPin className="w-4 h-4" />
            {fr ? "Demander les polygones (NDA)" : "Request polygons (NDA)"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/eudr"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E8833D]/40 text-[#D06B1F] font-semibold text-sm hover:bg-[#FEF3E7] transition-colors"
          >
            {fr ? "Voir la conformité EUDR" : "See EUDR compliance"}
          </Link>
        </>
      }
    />
  );
}
