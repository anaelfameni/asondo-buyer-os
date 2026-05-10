"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EUDRBadge } from "./PartnerLogos";

interface IndustryAlignmentProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
  titleOverride?: string;
}

/**
 * Section "Standards de l'industrie" qui affiche les logos officiels des organisations
 * auxquelles Asondo s'aligne (CCC : licence officielle) ou dont les standards sont suivis
 * (FCC, Rainforest Alliance, EUDR).
 *
 * NOTE d'intégrité : seul CCC est un lien direct (Asondo est exportateur agréé CCC 2025/26).
 * FCC et Rainforest Alliance sont des standards de l'industrie auxquels les pratiques d'Asondo
 * s'alignent. EUDR est le règlement européen visé par la conformité.
 */
export function IndustryAlignment({
  variant = "dark",
  size = "md",
  showTitle = true,
  titleOverride,
}: IndustryAlignmentProps) {
  const isLight = variant === "light";

  const logoSize = {
    sm: { w: 80, h: 50, card: "h-16 px-4" },
    md: { w: 120, h: 64, card: "h-20 px-5" },
    lg: { w: 160, h: 80, card: "h-24 px-6" },
  }[size];

  const titleClass = isLight
    ? "text-[#6B7280]"
    : "text-white/60";

  const logoCardClass = isLight
    ? "bg-white border-[#E8833D]/15 shadow-sm hover:shadow-md hover:border-[#E8833D]/30"
    : "bg-white/10 border-white/15 backdrop-blur-md hover:bg-white/15 hover:border-white/25";

  return (
    <div>
      {showTitle && (
        <p
          className={`text-[11px] uppercase tracking-[0.22em] ${titleClass} font-bold mb-5 flex items-center gap-2`}
        >
          <span
            className={`h-px w-8 ${isLight ? "bg-[#E8833D]/40" : "bg-white/30"}`}
          />
          {titleOverride ?? "Standards de l'industrie & accréditations"}
        </p>
      )}

      <div className="flex flex-wrap items-stretch gap-3">
        {/* CCC — accréditation officielle (logo réel) */}
        <LogoCard
          className={logoCardClass}
          sizeClass={logoSize.card}
          title="Exportateur agréé CCC 2025/26"
          subtitle="Conseil Café-Cacao — Côte d'Ivoire"
          isLight={isLight}
        >
          <Image
            src="/CCClogo.jpg"
            alt="Conseil du Café-Cacao — Côte d'Ivoire"
            width={logoSize.w - 10}
            height={logoSize.h - 20}
            className="object-contain h-full w-auto"
            style={{ maxHeight: logoSize.h - 24 }}
          />
        </LogoCard>

        {/* FCC — standard professionnel aligné */}
        <LogoCard
          className={logoCardClass}
          sizeClass={logoSize.card}
          title="Federation of Cocoa Commerce"
          subtitle="Standards contractuels alignés"
          isLight={isLight}
        >
          <Image
            src="/FCClogo.jpg"
            alt="Federation of Cocoa Commerce"
            width={logoSize.w - 10}
            height={logoSize.h - 20}
            className="object-contain h-full w-auto"
            style={{ maxHeight: logoSize.h - 24 }}
          />
        </LogoCard>

        {/* Rainforest Alliance — standard durabilité aligné */}
        <LogoCard
          className={logoCardClass}
          sizeClass={logoSize.card}
          title="Rainforest Alliance"
          subtitle="Pratiques durables alignées"
          isLight={isLight}
        >
          <Image
            src="/RainforestAllianceLogo.png"
            alt="Rainforest Alliance"
            width={logoSize.w - 10}
            height={logoSize.h - 20}
            className="object-contain h-full w-auto"
            style={{ maxHeight: logoSize.h - 24 }}
          />
        </LogoCard>

        {/* EUDR — conformité réglementaire visée */}
        <LogoCard
          className={logoCardClass}
          sizeClass={logoSize.card}
          title="EUDR Ready"
          subtitle="EU Deforestation Regulation"
          isLight={isLight}
          badge="En préparation"
        >
          <div className={isLight ? "text-[#1F3D2F]" : "text-white"}>
            <EUDRBadge width={logoSize.w - 20} height={logoSize.h - 20} />
          </div>
        </LogoCard>
      </div>
    </div>
  );
}

interface LogoCardProps {
  children: React.ReactNode;
  className: string;
  sizeClass: string;
  title: string;
  subtitle: string;
  isLight: boolean;
  badge?: string;
}

function LogoCard({ children, className, sizeClass, title, subtitle, isLight, badge }: LogoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col justify-center items-center gap-1 border rounded-xl transition-all ${sizeClass} ${className}`}
      title={`${title} — ${subtitle}`}
    >
      {badge && (
        <span
          className={`absolute -top-2 right-2 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full ${
            isLight
              ? "bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white"
              : "bg-[#F2B83E] text-[#1F3D2F]"
          }`}
        >
          {badge}
        </span>
      )}
      <div className="flex items-center justify-center flex-1 w-full">{children}</div>
      {/* Tooltip on hover */}
      <div
        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 px-3 py-1.5 rounded-lg text-[10px] font-medium shadow-lg ${
          isLight ? "bg-[#1F3D2F] text-white" : "bg-white text-[#1A1A1A]"
        }`}
      >
        {subtitle}
      </div>
    </motion.div>
  );
}
