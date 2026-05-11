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
        ? "Génération du Buyer Pack en cours…"
        : "Generating Buyer Pack…",
      { duration: 30_000 }
    );

    try {
      const res = await fetch("/api/buyer-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: locale, source: "public-cta" }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error(
            locale === "fr"
              ? "Trop de téléchargements depuis votre poste. Réessayez plus tard."
              : "Too many downloads from your IP. Please try again later."
          );
        }
        throw new Error(
          locale === "fr"
            ? "Le serveur n'a pas pu générer le PDF. Réessayez."
            : "Server failed to generate the PDF. Please try again."
        );
      }

      const blob = await res.blob();
      const filename =
        extractFilename(res.headers.get("Content-Disposition")) ??
        `Asondo-Buyer-Pack-${new Date().toISOString().slice(0, 10)}.pdf`;

      // Trigger browser download.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success(
        locale === "fr"
          ? "Buyer Pack téléchargé."
          : "Buyer Pack downloaded.",
        { id: toastId }
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : locale === "fr"
          ? "Erreur inattendue."
          : "Unexpected error.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
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

/**
 * Pulls the filename out of a Content-Disposition header. The server
 * sets it to `attachment; filename="Asondo-Buyer-Pack-…"`. We don't
 * trust the client to decide the name (avoids HTML injection).
 */
function extractFilename(disposition: string | null): string | null {
  if (!disposition) return null;
  const match = /filename\*?="?([^";]+)"?/i.exec(disposition);
  if (!match) return null;
  const raw = match[1].trim();
  // Drop charset prefix like `UTF-8''` if present (RFC 5987).
  const cleaned = raw.replace(/^[A-Za-z0-9-]+''/, "");
  return cleaned || null;
}
