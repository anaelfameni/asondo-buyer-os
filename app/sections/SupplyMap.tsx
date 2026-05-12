"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";
import { SectionBackground } from "@/app/components/SectionBackground";
import { Building2, Trees, Phone, Mail, Globe } from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import("@/app/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gradient-to-br from-[#FEF3E7] to-[#F4A866]/30 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="text-[#D06B1F] text-sm font-medium">Chargement de la carte...</div>
    </div>
  ),
});

export function SupplyMap() {
  const { t } = useI18n();
  const sourcingZones = asondoData.supplyZones.filter((z) => z.type === "sourcing-region");
  // Map zones to localized labels by their position in the data array.
  // Order in asondo-data.ts: 0=central, 1=eastern, 2=western.
  const zoneLabels: string[] = [
    t.supply.zones.central,
    t.supply.zones.eastern,
    t.supply.zones.western,
  ];

  return (
    <section
      id="supply-map"
      className="relative py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* A real producer on a real Ivorian forest road — what "Réseau
          d'approvisionnement" actually looks like on the ground. */}
      <SectionBackground src="/photo2.jpg" />

      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FEF3E7] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#1F3D2F]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
            {t.supply.title}
          </h2>
          <p className="text-lg text-[#6B7280] leading-relaxed text-pretty">
            {t.supply.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AnimatedSection className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#1F3D2F]/10 h-full min-h-[520px] bg-white border border-[#E8833D]/15">
              <InteractiveMap />
            </div>
          </AnimatedSection>

          <div className="space-y-5">
            <AnimatedSection delay={0.1}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card-premium rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shadow-lg shadow-[#E8833D]/30">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {t.supply.headquarters}
                  </h3>
                </div>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                  {asondoData.identity.address}
                </p>
                <div className="space-y-2 pt-3 border-t border-[#E8833D]/15">
                  <ContactLine icon={Phone} href={`tel:${asondoData.identity.phone}`}>
                    {asondoData.identity.phone}
                  </ContactLine>
                  <ContactLine icon={Mail} href={`mailto:${asondoData.identity.email}`}>
                    {asondoData.identity.email}
                  </ContactLine>
                  <ContactLine icon={Globe} href={asondoData.identity.website} target="_blank">
                    asondo.ci
                  </ContactLine>
                </div>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card-premium rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F3D2F] to-[#0F2619] flex items-center justify-center shadow-lg shadow-[#1F3D2F]/30">
                    <Trees className="w-5 h-5 text-[#F2B83E]" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {t.supply.sourcingRegions}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {sourcingZones.map((zone, idx) => (
                    <li key={zone.name} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E8833D] mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          {zoneLabels[idx] ?? zone.region}
                        </p>
                        <p className="text-xs text-[#6B7280]">{zone.department}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[#6B7280] italic mt-4 pt-4 border-t border-[#E8833D]/15">
                  {t.supply.ndaNote}
                </p>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1F3D2F] to-[#0F2619] p-6 shadow-xl shadow-[#1F3D2F]/30"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2B83E] font-bold mb-4">
                  {t.supply.criteriaTitle}
                </p>
                <ol className="space-y-2.5">
                  {t.supply.criteria.map((c, i) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-white/90">
                      <span className="w-6 h-6 rounded-full bg-[#F2B83E]/20 text-[#F2B83E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  href,
  target,
  children,
}: {
  icon: React.ElementType;
  href: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 text-sm text-[#4B5563] hover:text-[#D06B1F] transition-colors"
    >
      <Icon className="w-4 h-4 text-[#E8833D]" />
      {children}
    </a>
  );
}
