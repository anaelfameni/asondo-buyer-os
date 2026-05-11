"use client";

import { motion } from "framer-motion";
import { Activity, Calendar, FileSignature, Package } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Honest, public status snapshot of where Asondo currently sits on
 * the EUDR ramp-up curve. Deliberately uses placeholder counters
 * ("—") instead of fabricated volumes so we never imply trades we
 * haven't executed yet. The Compliance Officer updates these values
 * monthly via the CEO console (Phase E).
 *
 * Re-use this banner on `/eudr`, `/reseau`, and the home above the
 * `RFQForm` to set buyer expectations clearly.
 */
export function TrackRecordBanner() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619] text-white p-8 sm:p-10 relative overflow-hidden shadow-xl shadow-[#1F3D2F]/20"
        >
          <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-[#E8833D]/15 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-[260px] h-[260px] rounded-full bg-[#F2B83E]/15 blur-[80px] pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F2B83E] uppercase tracking-wider mb-3">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  {fr
                    ? "Statut opérationnel — temps réel"
                    : "Operational status — real-time"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {fr
                    ? "Première campagne EUDR 2025/26"
                    : "First EUDR season 2025/26"}
                </h2>
                <p className="text-white/80 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                  {fr
                    ? "Asondo est en phase de lancement opérationnel. Nous publions ici l'état réel des contrats, volumes et DDS, sans embellissement."
                    : "Asondo is in operational ramp-up. We publish here the real state of contracts, volumes and DDS — without embellishment."}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard
                icon={FileSignature}
                value="—"
                label={
                  fr
                    ? "Contrats acheteurs sécurisés"
                    : "Secured buyer contracts"
                }
                hint={
                  fr
                    ? "Premiers contrats en cours de négociation"
                    : "First contracts in negotiation"
                }
              />
              <StatCard
                icon={Package}
                value="—"
                label={
                  fr ? "Volume expédié 2025/26 (TM)" : "Tonnage shipped 2025/26 (MT)"
                }
                hint={
                  fr
                    ? "Première campagne d'exportation"
                    : "First export season"
                }
              />
              <StatCard
                icon={Calendar}
                value="—"
                label={
                  fr
                    ? "DDS soumises à l'EUDR IS"
                    : "DDS submitted to EUDR IS"
                }
                hint={
                  fr
                    ? "Soumission par expédition à venir"
                    : "Per-shipment submission upcoming"
                }
              />
            </div>

            <p className="text-xs text-white/70 mt-6 italic">
              {fr
                ? "Mise à jour mensuelle par notre Compliance Officer EUDR. Aucun chiffre n'est inventé. Les acheteurs vérifiés reçoivent un statut détaillé sous NDA via le Buyer Pack."
                : "Updated monthly by our EUDR Compliance Officer. No number is fabricated. Verified buyers receive a detailed status under NDA via the Buyer Pack."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#F2B83E]/20 border border-[#F2B83E]/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#F2B83E]" />
        </div>
        <span className="text-3xl sm:text-4xl font-bold text-white">
          {value}
        </span>
      </div>
      <p className="text-sm font-semibold text-white mb-1">{label}</p>
      <p className="text-xs text-white/70 leading-snug">{hint}</p>
    </div>
  );
}
