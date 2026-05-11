"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { AsondoMark } from "../components/AsondoLogo";

export function SamplePackCTA() {
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const toastId = toast.loading(
      locale === "fr"
        ? "Ouverture du Buyer Pack…"
        : "Opening Buyer Pack…",
      { duration: 8_000 }
    );

    // Track the download attempt server-side BEFORE opening the new
    // tab. The fetch is fire-and-forget so a slow/failing tracker can
    // never block the actual PDF flow — the visitor still gets their
    // document. Persistence lives in `lib/buyer-pack-store.ts` and is
    // surfaced in the CEO console.
    try {
      void fetch("/api/buyer-pack-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: locale, source: "public-cta" }),
        // Use keepalive so the request survives even if the browser
        // immediately navigates away (it won't here, since we open in
        // a new tab — but it's the right semantic).
        keepalive: true,
      }).catch(() => {
        /* swallow — tracking is best effort */
      });
    } catch {
      /* network blocked / browser refusing fetch: continue anyway */
    }

    /*
     * New flow (Vercel-safe): open the `/print/buyer-pack` Next.js page
     * in a new tab. The page renders the same 7-section design that
     * Puppeteer used to snapshot, and then it auto-triggers the
     * browser's native print dialog (see PrintTrigger.tsx). The visitor
     * picks "Save as PDF" as the destination — identical Chromium
     * rendering, but with zero serverless cold-start risk.
     */
    const url = `/print/buyer-pack?lang=${encodeURIComponent(locale)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup) {
      // Pop-up blocked → fall back to a same-tab navigation so the
      // visitor can still reach the document.
      window.location.href = url;
    }

    toast.success(
      locale === "fr"
        ? "Document ouvert dans un nouvel onglet. Choisissez « Enregistrer au format PDF »."
        : 'Document opened in a new tab. Choose "Save as PDF" as destination.',
      { id: toastId }
    );

    // Brief lock to debounce double clicks; the UI quickly returns to
    // its default state.
    window.setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots-pack" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#F2B83E" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pack)" />
        </svg>
      </div>

      {/* Decorative orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#F2B83E]/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#E8833D]/15 blur-[120px]"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            {/* Decorative Asondo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#F2B83E]/20 blur-2xl rounded-full" />
                <AsondoMark size={72} color="#F2B83E" />
              </div>
            </motion.div>

            <h2 className="text-headline text-white mb-5 text-balance">
              {t.sample.title}
            </h2>
            <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.sample.subtitle}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl mx-auto">
              {t.sample.contents.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#F2B83E]/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F2B83E]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F2B83E]/40 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#F2B83E]" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-white/90 text-left font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#F2B83E] to-[#D4A017] text-[#1F3D2F] font-bold text-lg shadow-xl shadow-[#F2B83E]/30 hover:shadow-2xl hover:shadow-[#F2B83E]/50 hover:-translate-y-1 transition-all btn-premium disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isLoading
                ? locale === "fr"
                  ? "Génération en cours…"
                  : "Generating…"
                : t.sample.download}
            </button>

            <p className="text-sm text-white/50 mt-6 max-w-xl mx-auto leading-relaxed">
              {t.sample.footer}
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

