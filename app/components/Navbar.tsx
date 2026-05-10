"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";
import { LanguageToggle } from "./LanguageToggle";
import { AsondoLogo } from "./AsondoLogo";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.evidence, href: "#evidence-matrix" },
    { label: t.nav.network, href: "#supply-map" },
    { label: t.nav.programme, href: "#programme" },
    { label: t.nav.askUs, href: "#ai-copilot" },
  ];

  const goToRFQ = () => {
    document.getElementById("rfq-form")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
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
          <a href="#" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <AsondoLogo
              variant="full"
              size="md"
              color={scrolled ? "orange" : "white"}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full group ${
                  scrolled
                    ? "text-[#1A1A1A] hover:text-[#D06B1F]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={`absolute inset-0 rounded-full transition-opacity ${
                    scrolled ? "bg-[#FEF3E7]" : "bg-white/10"
                  } opacity-0 group-hover:opacity-100`}
                />
              </a>
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
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block px-4 py-3 text-[#1A1A1A] hover:bg-[#FEF3E7] hover:text-[#D06B1F] rounded-xl font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
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
