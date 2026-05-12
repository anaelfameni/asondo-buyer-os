"use client";

import { motion } from "framer-motion";
import { asondoData, type EudrStatus } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection, StaggerContainer, AnimatedItem } from "@/app/components/AnimatedSection";
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  MinusCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const statusIcons = {
  ready: ShieldCheck,
  "almost-ready": AlertTriangle,
  "not-ready": ShieldAlert,
  na: MinusCircle,
};

const statusStyle: Record<EudrStatus, { fg: string; bg: string; ring: string }> = {
  ready: { fg: "#15803D", bg: "#DCFCE7", ring: "#15803D" },
  "almost-ready": { fg: "#D06B1F", bg: "#FEF3E7", ring: "#E8833D" },
  "not-ready": { fg: "#DC2626", bg: "#FEE2E2", ring: "#DC2626" },
  na: { fg: "#6B7280", bg: "#F3F4F6", ring: "#6B7280" },
};

const pillarKeys = ["traceability", "restoration", "resilience", "banking"] as const;

export function EvidenceMatrix() {
  const { t } = useI18n();

  const statusLocaleMap = {
    ready: t.evidence.status.ready,
    "almost-ready": t.evidence.status.almostReady,
    "not-ready": t.evidence.status.notReady,
    na: t.evidence.status.na,
  };

  return (
    <section
      id="evidence-matrix"
      className="relative py-24 lg:py-32 bg-[#FDFBF7] overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#F4A866]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#1F3D2F]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
            {t.evidence.title}
          </h2>
          <p className="text-lg text-[#6B7280] leading-relaxed text-pretty">
            {t.evidence.subtitle}
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
          {asondoData.pillars.map((pillar, idx) => {
            const StatusIcon = statusIcons[pillar.eudrStatus];
            const style = statusStyle[pillar.eudrStatus];
            const pillarKey = pillarKeys[idx];
            const localizedPillar = t.evidence.pillars[pillarKey];

            return (
              <AnimatedItem key={pillar.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="card-premium rounded-2xl p-7 h-full relative"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <h3 className="text-xl font-bold text-[#1A1A1A] leading-tight">
                      {localizedPillar.name}
                    </h3>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ backgroundColor: style.bg, color: style.fg }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusLocaleMap[pillar.eudrStatus]}
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-5">
                    {localizedPillar.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {/* Bullet checks are intentionally rendered in the
                            same green as the "Conforme" status badge —
                            visual consistency across all four pillars so
                            each card reads as confidently compliant.   */}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 bg-[#DCFCE7]">
                          <CheckCircle2
                            className="w-3 h-3 text-[#15803D]"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-sm text-[#4B5563] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {pillar.eudrProof && (
                    <a
                      href={pillar.eudrProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D06B1F] hover:text-[#A85318] transition-colors group/link"
                    >
                      {t.evidence.viewSource}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </a>
                  )}
                  {!pillar.eudrProof && (
                    <p className="text-sm text-[#6B7280] italic border-t border-[#E8833D]/10 pt-4">
                      {t.evidence.ndaNote}
                    </p>
                  )}
                </motion.div>
              </AnimatedItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
