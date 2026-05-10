"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";
import { AnimatedCounter } from "@/app/components/AnimatedCounter";
import { CheckCircle2, ChevronDown, ArrowRight, Sparkles, MapPin, TreePine, TrendingUp, Wallet } from "lucide-react";

const pillarConfig: Record<string, { grad: string; ring: string; icon: React.ElementType }> = {
  traceability: { grad: "from-[#E8833D] to-[#D06B1F]", ring: "#E8833D", icon: MapPin },
  restoration: { grad: "from-[#1F3D2F] to-[#0F2619]", ring: "#1F3D2F", icon: TreePine },
  resilience: { grad: "from-[#F2B83E] to-[#D4A017]", ring: "#F2B83E", icon: TrendingUp },
  banking: { grad: "from-[#D06B1F] to-[#A85318]", ring: "#D06B1F", icon: Wallet },
};

const pillarKeys = ["traceability", "restoration", "resilience", "banking"] as const;

export function ProgrammeDashboard() {
  const { t } = useI18n();
  const [openPillar, setOpenPillar] = useState<string | null>("traceability");
  const totalItems = asondoData.pillars.reduce((acc, p) => acc + p.items.length, 0);

  return (
    <section id="programme" className="relative py-24 lg:py-32 bg-[#FDFBF7] overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#FEF3E7] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F4A866]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
            {t.programme.title}
          </h2>
          <p className="text-lg text-[#6B7280] leading-relaxed text-pretty">
            {t.programme.subtitle}
          </p>
        </AnimatedSection>

        {/* Animated stat banner */}
        <AnimatedSection delay={0.15} className="max-w-4xl mx-auto mb-12">
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619] text-white overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#E8833D]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#F2B83E]/10 blur-3xl pointer-events-none" />

            <div className="relative text-center">
              <div className="text-3xl md:text-5xl font-black text-[#F2B83E] leading-none">
                <AnimatedCounter value={asondoData.pillars.length} />
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wider mt-2 text-white/70 font-semibold">
                Piliers
              </div>
            </div>
            <div className="relative text-center">
              <div className="text-3xl md:text-5xl font-black text-[#E8833D] leading-none">
                <AnimatedCounter value={totalItems} />
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wider mt-2 text-white/70 font-semibold">
                Engagements
              </div>
            </div>
            <div className="relative text-center">
              <div className="text-3xl md:text-5xl font-black text-white leading-none">
                <AnimatedCounter value={15} />
                <span className="text-2xl">+</span>
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wider mt-2 text-white/70 font-semibold">
                Ans d&apos;expérience
              </div>
            </div>
            <div className="relative text-center">
              <div className="text-3xl md:text-5xl font-black text-white leading-none">
                <AnimatedCounter value={1} suffix="er" />
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wider mt-2 text-white/70 font-semibold">
                Producteur mondial
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-4">
          {asondoData.pillars.map((pillar, idx) => {
            const isOpen = openPillar === pillar.id;
            const pillarKey = pillarKeys[idx];
            const localizedPillar = t.evidence.pillars[pillarKey];
            const cfg = pillarConfig[pillar.id];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`card-premium rounded-2xl overflow-hidden ${isOpen ? "shadow-xl" : ""}`}
                style={isOpen ? { borderColor: `${cfg.ring}40` } : {}}
              >
                <button
                  onClick={() => setOpenPillar(isOpen ? null : pillar.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.grad} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] leading-tight">
                        {localizedPillar.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] mt-0.5">
                        {localizedPillar.items.length} {t.programme.itemsCount}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FEF3E7] group-hover:bg-[#F4A866]/30 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-[#D06B1F]" strokeWidth={2.5} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="pl-16 border-l-2 ml-6" style={{ borderColor: `${cfg.ring}30` }}>
                          <div className="grid gap-2.5 pt-2">
                            {localizedPillar.items.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-[#FDFBF7] hover:bg-[#FEF3E7] transition-colors"
                              >
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${cfg.ring}20` }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: cfg.ring }} strokeWidth={3} />
                                </div>
                                <span className="text-sm text-[#4B5563] leading-relaxed">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-14">
          <p className="text-[#6B7280] mb-5">{t.programme.mappingQuestion}</p>
          <a
            href="#evidence-matrix"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#E8833D] text-[#D06B1F] font-semibold hover:bg-[#E8833D] hover:text-white transition-all shadow-sm"
          >
            {t.programme.viewMatrix}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
