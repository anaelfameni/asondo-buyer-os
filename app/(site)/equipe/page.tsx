"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  UserCog,
  Mail,
  Users,
} from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { SectionBackground } from "@/app/components/SectionBackground";
import { useI18n } from "@/lib/i18n-context";
import { asondoData } from "@/lib/asondo-data";

// Lucide icons accept the same SVG props as plain SVG elements;
// widening the icon type lets us pass `style` for the dynamic
// brand-colour swatch on each role card without losing type safety.
type Role = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name?: string;
  title: { fr: string; en: string };
  status: { fr: string; en: string };
  description: { fr: string; en: string };
  href?: string;
  badgeColor: string;
};

/**
 * Only roles with a verified, public-fact basis are listed here.
 *
 *  - The PDG is the legal representative of the company; that fact is
 *    public via the RCCM CI-ABJ-03-2020-B14-11898 (annonce notariée
 *    Maître Nanou-Adou, Abidjan.net).
 *  - The EUDR Compliance Officer is required by Article 4 of EU
 *    Regulation 2023/1115 for any cocoa operator placing goods on the
 *    EU market — the function exists, the appointed name is
 *    deliberately disclosed under NDA / Buyer Pack only.
 *
 * The other functions an exporter typically needs (sourcing, quality,
 * logistics, finance, inclusive banking) are deliberately not listed
 * with a fictional “recruitment in progress” badge. Open recruitments
 * are aggregated in a single honest section below.
 */
const ROLES: Role[] = [
  {
    icon: Briefcase,
    name: asondoData.leadership.ceoName,
    title: {
      fr: asondoData.leadership.ceoRole,
      en: asondoData.leadership.ceoRoleEn,
    },
    status: { fr: "En fonction", en: "In office" },
    description: {
      fr: "Fondateur et représentant légal de ASONDO SA. Il a fondé la société et en assure la Direction Générale, portant l'engagement d'Asondo dans la filière cacao ivoirienne durable, avec 15 ans d'expérience dans le négoce de matières premières et la supply chain (cf. asondo.ci/our-story).",
      en: "Founder and legal representative of ASONDO SA. He founded the company and runs it as Chairman-CEO, carrying Asondo's commitment to a sustainable Ivorian cocoa sector, with 15 years of soft-commodity trading and supply-chain experience (cf. asondo.ci/our-story).",
    },
    badgeColor: "#1F3D2F",
  },
  {
    icon: UserCog,
    title: { fr: "Responsable Conformité EUDR", en: "EUDR Compliance Officer" },
    status: {
      fr: "Mandat actif — nom communiqué sous Buyer Pack",
      en: "Mandate active — name disclosed under Buyer Pack",
    },
    description: {
      fr: "Fonction requise par l'article 4 du Règlement (UE) 2023/1115. Pilote du système de diligence raisonnée Asondo : collecte des polygones, évaluation du risque de déforestation, soumission des Déclarations de Diligence Raisonnée (DDS) à l'EUDR Information System. Le nom est communiqué nominativement aux acheteurs UE sous NDA.",
      en: "Function required by Article 4 of Regulation (EU) 2023/1115. Steers the Asondo due-diligence system: polygon collection, deforestation-risk assessment, submission of Due Diligence Statements (DDS) to the EUDR Information System. Name disclosed by name to EU buyers under NDA.",
    },
    href: "/eudr/compliance-officer",
    badgeColor: "#D06B1F",
  },
];

/**
 * Functions Asondo plans to staff or grow as the EUDR ramp-up
 * progresses. We list them as a single grouped section rather than
 * pretending each is a formal open recruitment with a defined head
 * count, which would be inventing structure.
 */
const RAMP_UP_AREAS = [
  { fr: "Sourcing terrain (relations coopératives, audits)", en: "Field sourcing (cooperative relations, audits)" },
  { fr: "Qualité (fermentation, humidité, fèves cassées)", en: "Quality (fermentation, moisture, broken beans)" },
  { fr: "Logistique & export (FOB Abidjan, CIF Europe)", en: "Logistics & export (FOB Abidjan, CIF Europe)" },
  { fr: "Finance et banque inclusive (mobile banking, AVEC)", en: "Finance and inclusive banking (mobile banking, VSLA)" },
];

export default function EquipePage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <main>
      <PageHero
        eyebrow={fr ? "Équipe · Direction" : "Team · Leadership"}
        title={
          fr
            ? "Une équipe qui se construit en transparence."
            : "A team that builds itself in the open."
        }
        subtitle={
          fr
            ? "Cette page liste les fonctions dont l'existence est juridiquement vérifiable (représentant légal de la SA, responsable conformité EUDR requis par l'article 4 du Règlement UE 2023/1115). Les autres fonctions opérationnelles montent en charge avec la structure ; nous préférons les regrouper plutôt qu'inventer un organigramme."
            : "This page lists functions whose existence is legally verifiable (legal representative of the SA, EUDR Compliance Officer required by Article 4 of EU Regulation 2023/1115). Other operational functions ramp up with the structure — we group them rather than invent an org chart."
        }
        breadcrumbs={[{ label: fr ? "Équipe" : "Team" }]}
        cta={
          <Link
            href="mailto:talent@asondo.ci"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D06B1F] text-white font-semibold text-sm hover:bg-[#A85318] transition-colors shadow-lg shadow-[#D06B1F]/25"
          >
            <Mail className="w-4 h-4" />
            {fr ? "Postuler" : "Apply"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* Roles grid */}
      <section className="relative py-16 sm:py-20 bg-[#FDFBF7] overflow-hidden">
        {/* Drying-rack photo behind the team grid — same image used on
            the Evidence Matrix, communicating discipline and quality
            standards behind the people we list. */}
        <SectionBackground src="/photo3.jpg" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ROLES.map((role, i) => {
              const Icon = role.icon;
              const inOffice = role.status[locale]
                .toLowerCase()
                .includes(fr ? "fonction" : "office");

              const cardInner = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${role.badgeColor}15`,
                        border: `1px solid ${role.badgeColor}33`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: role.badgeColor }}
                      />
                    </div>
                    <span
                      className={`text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                        inOffice
                          ? "bg-[#1F3D2F]/10 text-[#1F3D2F]"
                          : "bg-[#FEF3E7] text-[#A85318]"
                      }`}
                    >
                      {role.status[locale]}
                    </span>
                  </div>
                  {role.name ? (
                    <p className="text-xs uppercase tracking-wider text-[#A85318] font-bold mb-1">
                      {role.name}
                    </p>
                  ) : null}
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    {role.title[locale]}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
                    {role.description[locale]}
                  </p>
                  {role.href ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#D06B1F]">
                      {fr ? "Voir la page dédiée" : "See dedicated page"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  ) : null}
                </>
              );

              const cardClass = `block card-premium p-7 rounded-2xl h-full ${
                role.href ? "cursor-pointer group" : ""
              }`;

              return (
                <motion.div
                  key={role.title.en}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  {role.href ? (
                    <Link href={role.href} className={cardClass}>
                      {cardInner}
                    </Link>
                  ) : (
                    <div className={cardClass}>{cardInner}</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Operational ramp-up areas + recruitment CTA */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full bg-[#E8833D]/15 blur-[80px] pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F2B83E] uppercase tracking-wider mb-4">
                  <Users className="w-3.5 h-3.5" />
                  {fr ? "Montée en charge opérationnelle" : "Operational ramp-up"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  {fr
                    ? "Construisez avec nous la prochaine génération du cacao ivoirien."
                    : "Build with us the next generation of Ivorian cocoa."}
                </h2>
                <p className="text-white/85 mb-4 leading-relaxed">
                  {fr
                    ? "Asondo monte en charge sur les fonctions opérationnelles suivantes. Plutôt que d'afficher un nombre de postes inventé, nous regroupons ici les domaines où nous renforçons l'équipe :"
                    : "Asondo is ramping up on the following operational functions. Rather than publishing an invented number of openings, we group here the areas where we are strengthening the team:"}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                  {RAMP_UP_AREAS.map((area) => (
                    <li
                      key={area.en}
                      className="flex items-start gap-2 text-sm text-white/90"
                    >
                      <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#F2B83E] shrink-0" />
                      <span>{fr ? area.fr : area.en}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="mailto:talent@asondo.ci"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#E8833D] text-white font-semibold text-sm hover:bg-[#D06B1F] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    talent@asondo.ci
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/programme"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                  >
                    {fr ? "Voir notre programme" : "See our programme"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Code of conduct anchor */}
          <div className="mt-10 max-w-3xl mx-auto text-center text-sm text-[#6B7280]">
            <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-[#D06B1F]" />
            {fr
              ? "Tous les membres de l'équipe et nos coopératives partenaires adhèrent au"
              : "All team members and partner cooperatives adhere to the"}{" "}
            <Link
              href="/code-de-conduite"
              className="text-[#D06B1F] hover:underline font-medium"
            >
              {fr
                ? "Code de Conduite Fournisseurs Asondo"
                : "Asondo Supplier Code of Conduct"}
            </Link>
            .
          </div>
        </div>
      </section>
    </main>
  );
}
