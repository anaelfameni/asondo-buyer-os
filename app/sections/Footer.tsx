"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { AsondoLogo } from "../components/AsondoLogo";
import { EUDRBadge } from "../components/PartnerLogos";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619] text-white overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8833D] to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#E8833D]/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-5">
              <AsondoLogo variant="full" size="lg" color="white" className="mb-6" />
              <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
                {t.footer.tagline}
              </p>

              {/* Industry alignment — real official logos rendered via next/image */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#F2B83E] font-semibold mb-3">
                  Standards de l&apos;industrie
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-white/95 rounded-2xl px-5 py-3 max-w-md">
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
                    alt="Rainforest Alliance Certified"
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
            <div className="md:col-span-4">
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                {t.footer.contact}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8833D] group-hover:border-[#E8833D] transition-colors">
                    <MapPin className="w-4 h-4 text-[#F2B83E] group-hover:text-white" />
                  </div>
                  <div className="text-sm text-white/75 leading-relaxed">
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
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8833D] group-hover:border-[#E8833D] transition-colors">
                      <Phone className="w-4 h-4 text-[#F2B83E] group-hover:text-white" />
                    </div>
                    <span className="text-sm text-white/75 group-hover:text-white transition-colors">
                      {asondoData.identity.phone}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${asondoData.identity.email}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8833D] group-hover:border-[#E8833D] transition-colors">
                      <Mail className="w-4 h-4 text-[#F2B83E] group-hover:text-white" />
                    </div>
                    <span className="text-sm text-white/75 group-hover:text-white transition-colors">
                      {asondoData.identity.email}
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Links column */}
            <div className="md:col-span-3">
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "#evidence-matrix", label: t.footer.links.eudr },
                  { href: "#supply-map", label: t.footer.links.network },
                  { href: "#programme", label: t.footer.links.programme },
                  { href: "#rfq-form", label: t.footer.links.rfq },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-[#F2B83E] transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10 flex items-center justify-center"
          >
            <p className="text-xs text-white/50 text-center">
              © {new Date().getFullYear()} Asondo.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
