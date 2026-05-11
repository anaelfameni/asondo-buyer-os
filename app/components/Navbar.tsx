"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { LanguageToggle } from "./LanguageToggle";
import { AsondoLogo } from "./AsondoLogo";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  FileSignature,
  UserCog,
  Users,
  ScrollText,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";

/**
 * One leaf entry in a dropdown. Can be either an internal route or an
 * in-page anchor (`/#section-id`); both go through `next/link` so
 * client-side navigation stays intact.
 */
type NavLeaf = {
  label: { fr: string; en: string };
  description?: { fr: string; en: string };
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

/**
 * A navbar entry — either a flat link (no `children`) or a parent that
 * opens a dropdown on hover (desktop) / accordion (mobile). Even when
 * `children` is set, `href` is still followed when the user clicks the
 * parent label so each topic always has a discoverable canonical page.
 */
type NavGroup = {
  label: { fr: string; en: string };
  href: string;
  children?: NavLeaf[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: { fr: "Conformité", en: "Compliance" },
    href: "/eudr",
    children: [
      {
        label: { fr: "Aperçu EUDR & matrice", en: "EUDR overview & matrix" },
        description: {
          fr: "Notre lecture pilier-par-pilier du Règlement UE 2023/1115.",
          en: "Our pillar-by-pillar reading of EU Regulation 2023/1115.",
        },
        href: "/eudr",
        icon: ShieldCheck,
      },
      {
        label: { fr: "Compliance Officer", en: "Compliance Officer" },
        description: {
          fr: "Responsable conformité EUDR (article 4).",
          en: "EUDR Compliance Officer (Article 4).",
        },
        href: "/eudr/compliance-officer",
        icon: UserCog,
      },
      {
        label: { fr: "Modèle DDS", en: "DDS template" },
        description: {
          fr: "Modèle public de Déclaration de Diligence Raisonnée.",
          en: "Public Due Diligence Statement template.",
        },
        href: "/eudr/due-diligence-statement",
        icon: FileSignature,
      },
    ],
  },
  {
    label: { fr: "Réseau", en: "Network" },
    href: "/reseau",
  },
  {
    label: { fr: "Programme", en: "Programme" },
    href: "/programme",
  },
  {
    label: { fr: "À propos", en: "About" },
    href: "/equipe",
    children: [
      {
        label: { fr: "Équipe & gouvernance", en: "Team & governance" },
        description: {
          fr: "Direction générale et fonctions clés.",
          en: "Chief executive and key functions.",
        },
        href: "/equipe",
        icon: Users,
      },
      {
        label: { fr: "Code de conduite", en: "Code of conduct" },
        description: {
          fr: "Engagements fournisseurs Asondo.",
          en: "Asondo supplier commitments.",
        },
        href: "/code-de-conduite",
        icon: ScrollText,
      },
      {
        label: { fr: "Mentions légales", en: "Legal notice" },
        description: {
          fr: "Identité, RCCM, hébergeur.",
          en: "Identity, RCCM, hosting.",
        },
        href: "/legal/mentions-legales",
        icon: FileText,
      },
      {
        label: { fr: "Confidentialité", en: "Privacy" },
        description: {
          fr: "Politique de protection des données.",
          en: "Data-protection policy.",
        },
        href: "/legal/confidentialite",
        icon: Lock,
      },
    ],
  },
  {
    label: { fr: "Assistant IA", en: "Ask AI" },
    href: "/#ai-copilot",
  },
];

export function Navbar() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Tracks which desktop dropdown is currently open (by parent href).
  // We only allow one open at a time; hovering a different parent
  // immediately switches focus so the menu feels responsive.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Mobile accordion: which parent has its sub-items expanded. `null`
  // means everything is collapsed; first tap on a parent expands it,
  // second tap navigates (matches the platform-conventional pattern).
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Small grace timeout so moving the cursor diagonally between the
  // parent button and the dropdown panel does not flicker the menu
  // closed mid-motion.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change so the user is not left with a
  // half-open dropdown after navigating to a new page.
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const goToRFQ = () => {
    setMobileOpen(false);
    if (pathname === "/") {
      document
        .getElementById("rfq-form")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/contact");
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(208,107,31,0.15)] border-b border-[#E8833D]/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <AsondoLogo
              variant="full"
              size="md"
              color={scrolled ? "orange" : "white"}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_GROUPS.map((group) => (
              <NavGroupItem
                key={group.href}
                group={group}
                locale={locale}
                scrolled={scrolled}
                isOpen={openDropdown === group.href}
                onOpen={() => {
                  cancelClose();
                  setOpenDropdown(group.href);
                }}
                onClose={scheduleClose}
                onCloseImmediate={() => {
                  cancelClose();
                  setOpenDropdown(null);
                }}
              />
            ))}
          </div>

          {/* Right: lang + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle variant={scrolled ? "dark" : "light"} />
            <button
              onClick={goToRFQ}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all btn-premium ${
                scrolled
                  ? "bg-[#E8833D] text-white hover:bg-[#D06B1F] shadow-lg shadow-[#E8833D]/25"
                  : "bg-white text-[#D06B1F] hover:bg-[#FEF3E7] shadow-lg"
              }`}
            >
              {t.nav.requestQuote}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageToggle variant={scrolled ? "dark" : "light"} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              className={`p-2 rounded-full transition-colors ${
                scrolled ? "hover:bg-[#FEF3E7]" : "hover:bg-white/10"
              }`}
            >
              {mobileOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-[#1A1A1A]" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-[#1A1A1A]" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-white rounded-2xl mt-3 mb-4 p-3 border border-[#E8833D]/15 shadow-xl">
                {NAV_GROUPS.map((group, i) => (
                  <MobileNavGroup
                    key={group.href}
                    group={group}
                    locale={locale}
                    delay={i * 0.05}
                    expanded={mobileExpanded === group.href}
                    onToggleExpand={() =>
                      setMobileExpanded((prev) =>
                        prev === group.href ? null : group.href
                      )
                    }
                    onNavigate={() => {
                      setMobileOpen(false);
                      setMobileExpanded(null);
                    }}
                  />
                ))}
                <button
                  onClick={goToRFQ}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#E8833D] text-white hover:bg-[#D06B1F] px-5 py-3 rounded-xl font-semibold transition-all"
                >
                  {t.nav.requestQuote}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

/* ----------------------------------------------------- Desktop sub-views */

interface NavGroupItemProps {
  group: NavGroup;
  locale: "fr" | "en";
  scrolled: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCloseImmediate: () => void;
}

/**
 * Desktop navbar entry. Renders a plain `<Link>` if the group has no
 * children, or a hoverable parent + animated dropdown panel if it
 * does. Clicking the parent always navigates to its canonical href so
 * keyboard users can reach the page even without opening the dropdown.
 */
function NavGroupItem({
  group,
  locale,
  scrolled,
  isOpen,
  onOpen,
  onClose,
  onCloseImmediate,
}: NavGroupItemProps) {
  const hasChildren = !!group.children?.length;
  const baseClass = `relative px-4 py-2 text-sm font-medium transition-colors rounded-full group inline-flex items-center gap-1 ${
    scrolled
      ? "text-[#1A1A1A] hover:text-[#D06B1F]"
      : "text-white/90 hover:text-white"
  }`;

  if (!hasChildren) {
    return (
      <Link href={group.href} className={baseClass}>
        <span className="relative z-10">{group.label[locale]}</span>
        <span
          className={`absolute inset-0 rounded-full transition-opacity ${
            scrolled ? "bg-[#FEF3E7]" : "bg-white/10"
          } opacity-0 group-hover:opacity-100`}
        />
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
    >
      <Link
        href={group.href}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={baseClass}
      >
        <span className="relative z-10">{group.label[locale]}</span>
        <ChevronDown
          className={`relative z-10 w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        <span
          className={`absolute inset-0 rounded-full transition-opacity ${
            scrolled ? "bg-[#FEF3E7]" : "bg-white/10"
          } opacity-0 group-hover:opacity-100`}
        />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            // Bridge the gap between trigger and panel so the cursor
            // can travel without the dropdown closing mid-motion.
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[420px]"
          >
            <div className="bg-white rounded-2xl border border-[#E8833D]/15 shadow-2xl shadow-[#1F3D2F]/15 overflow-hidden">
              <div className="p-2">
                {group.children!.map((leaf) => {
                  const Icon = leaf.icon ?? Sparkles;
                  return (
                    <Link
                      key={leaf.href}
                      href={leaf.href}
                      onClick={onCloseImmediate}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FEF3E7] transition-colors group/leaf"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#FEF3E7] flex items-center justify-center shrink-0 group-hover/leaf:bg-[#E8833D]/20 transition-colors">
                        <Icon className="w-[18px] h-[18px] text-[#D06B1F]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#1A1A1A] group-hover/leaf:text-[#D06B1F] transition-colors">
                          {leaf.label[locale]}
                        </div>
                        {leaf.description ? (
                          <div className="text-xs text-[#6B7280] leading-snug mt-0.5">
                            {leaf.description[locale]}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------ Mobile sub-views */

interface MobileNavGroupProps {
  group: NavGroup;
  locale: "fr" | "en";
  delay: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onNavigate: () => void;
}

/**
 * Mobile accordion entry. Parents with children show a chevron and
 * expand on tap; the parent's own page stays reachable via a small
 * "Voir la page" link at the top of the expanded panel so the user
 * can navigate there without having to first dismiss the dropdown.
 */
function MobileNavGroup({
  group,
  locale,
  delay,
  expanded,
  onToggleExpand,
  onNavigate,
}: MobileNavGroupProps) {
  const hasChildren = !!group.children?.length;

  if (!hasChildren) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
      >
        <Link
          href={group.href}
          className="block px-4 py-3 text-[#1A1A1A] hover:bg-[#FEF3E7] hover:text-[#D06B1F] rounded-xl font-medium transition-colors"
          onClick={onNavigate}
        >
          {group.label[locale]}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3 text-[#1A1A1A] hover:bg-[#FEF3E7] hover:text-[#D06B1F] rounded-xl font-medium transition-colors"
      >
        <span>{group.label[locale]}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pl-3 ml-3 border-l border-[#E8833D]/20 my-1">
              <Link
                href={group.href}
                onClick={onNavigate}
                className="block px-3 py-2 text-xs uppercase tracking-wider text-[#A85318] font-bold hover:text-[#D06B1F] transition-colors"
              >
                {locale === "fr" ? "Vue d'ensemble" : "Overview"} →
              </Link>
              {group.children!.map((leaf) => {
                const Icon = leaf.icon ?? Sparkles;
                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#FEF3E7] hover:text-[#D06B1F] rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#D06B1F]" />
                    <span>{leaf.label[locale]}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
