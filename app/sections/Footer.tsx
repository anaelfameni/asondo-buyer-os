"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { AsondoLogo } from "../components/AsondoLogo";
import { EUDRBadge } from "../components/PartnerLogos";
import { Mail, Phone, MapPin, ArrowUpRight, Send, Loader2, Newspaper } from "lucide-react";

export function Footer() {
  const { t, locale } = useI18n();

  // Newsletter state lives at footer scope — kept minimal so the
  // rendered footer stays a single component file. Submission posts
  // to `/api/newsletter` (created in Phase D6) which currently is a
  // best-effort stub that stores the email locally.
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterBusy) return;
    const email = newsletterEmail.trim();
    if (!email) return;
    setNewsletterBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) {
        setNewsletterEmail("");
        toast.success(
          locale === "fr"
            ? "Inscription enregistrée. Merci !"
            : "Subscription confirmed. Thank you!"
        );
      } else if (res.status === 429) {
        toast.error(
          locale === "fr"
            ? "Trop de tentatives. Réessayez plus tard."
            : "Too many attempts. Please retry later."
        );
      } else {
        toast.error(
          locale === "fr"
            ? "Une erreur est survenue. Réessayez."
            : "Something went wrong. Please retry."
        );
      }
    } catch {
      toast.error(
        locale === "fr"
          ? "Réseau indisponible."
          : "Network unavailable."
      );
    } finally {
      setNewsletterBusy(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#E8833D] via-[#D06B1F] to-[#A85318] text-white overflow-hidden">
      {/* Top accent line — gold pops on the orange ground */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F2B83E] to-transparent opacity-70" />
      {/* Decorative orb in cocoa green for thermal contrast */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#1F3D2F]/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#F2B83E]/15 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-4">
              <AsondoLogo variant="full" size="lg" color="white" className="mb-6" />
              <p className="text-white/90 text-sm leading-relaxed max-w-md mb-6">
                {t.footer.tagline}
              </p>

              {/* Industry alignment — official logos rendered via next/image:
                  - CCC : licence d'exportateur agréé 2025/26 (Reuters / Conseil
                    du Café-Cacao). Vérifiable.
                  - FCC : entrée publique sur la page des membres FCC. Vérifiable.
                  - Rainforest Alliance : alignement sur le référentiel (pratiques
                    durables) ; le logo est rétabli ici à la demande du CEO pour
                    refléter la position de marché. Le tooltip "Pratiques
                    durables alignées" reste la formulation officielle.
                  - EUDR Ready badge : auto-déclaratif, libellé "ready" reflète
                    la lecture EUDR Asondo (cf. /eudr). */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-3">
                  {t.footer.industryStandards}
                </p>
                <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-3 bg-white/95 rounded-2xl px-5 py-3 w-fit shadow-lg shadow-black/15">
                  <Image
                    src="/CCClogo.jpg"
                    alt="Conseil du Café-Cacao — Côte d'Ivoire"
                    width={56}
                    height={36}
                    className="object-contain h-9 w-auto"
                  />
                  <Image
                    src="/FCClogo.jpg"
                    alt="Federation of Cocoa Commerce"
                    width={68}
                    height={36}
                    className="object-contain h-9 w-auto"
                  />
                  <Image
                    src="/RainforestAllianceLogo.png"
                    alt="Rainforest Alliance"
                    width={90}
                    height={36}
                    className="object-contain h-9 w-auto"
                  />
                  <div className="text-[#1F3D2F]">
                    <EUDRBadge width={68} height={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact column */}
            <div className="md:col-span-3">
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                {t.footer.contact}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-[#1F3D2F] group-hover:border-[#1F3D2F] transition-colors">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm text-white/90 leading-relaxed">
                    Treichville, zone 3<br />
                    Rue des ferronniers,<br />
                    immeuble le blason 3ème étage
                  </div>
                </li>
                <li>
                  <a
                    href={`tel:${asondoData.identity.phone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-[#1F3D2F] group-hover:border-[#1F3D2F] transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                      {asondoData.identity.phone}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${asondoData.identity.email}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-[#1F3D2F] group-hover:border-[#1F3D2F] transition-colors">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                      {asondoData.identity.email}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:press@asondo.ci"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-[#1F3D2F] group-hover:border-[#1F3D2F] transition-colors">
                      <Newspaper className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                      {t.footer.pressContact}
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links column */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/eudr", label: t.footer.links.eudr },
                  { href: "/reseau", label: t.footer.links.network },
                  { href: "/programme", label: t.footer.links.programme },
                  { href: "/contact", label: t.footer.links.rfq },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-[#1F3D2F] hover:font-semibold transition-all"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Newsletter column */}
            <div className="md:col-span-3 space-y-8">
              <div>
                <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                  {t.footer.legalTitle}
                </h3>
                <ul className="space-y-3">
                  {[
                    { href: "/legal/mentions-legales", label: t.footer.legal.mentions },
                    { href: "/legal/confidentialite", label: t.footer.legal.privacy },
                    { href: "/legal/cgu", label: t.footer.legal.cgu },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-[#1F3D2F] hover:font-semibold transition-all"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">
                  {t.footer.newsletterTitle}
                </h3>
                <form onSubmit={handleNewsletter} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t.footer.newsletterPlaceholder}
                      disabled={newsletterBusy}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/95 text-[#1F3D2F] placeholder:text-[#1F3D2F]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B83E] disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={newsletterBusy}
                      className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F3D2F] text-[#F2B83E] hover:bg-[#0F2619] transition-colors disabled:opacity-60"
                      aria-label={t.footer.newsletterCta}
                    >
                      {newsletterBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white/80">
                    {t.footer.newsletterHint}
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <p className="text-xs text-white/85 text-center sm:text-left">
              © {new Date().getFullYear()} Asondo SA · {t.footer.copyright}
            </p>
            {/* The RCCM is filed and verifiable (annonce notariée Maître
                Nanou-Adou, Abidjan.net) — see asondoData.legal.rccm.
                Don't say "pending publication", we have the number. */}
            <p className="text-xs text-white/70 text-center sm:text-right">
              {locale === "fr"
                ? `Abidjan, Côte d'Ivoire · RCCM ${asondoData.legal.rccm}`
                : `Abidjan, Côte d'Ivoire · RCCM ${asondoData.legal.rccm}`}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
