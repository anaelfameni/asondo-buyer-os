"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";
import { IndustryAlignment } from "../components/IndustryAlignment";
import { ShieldCheck, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

export function HeroBanner() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects (subtle)
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with Ken Burns parallax - PURE IMAGE */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/backgroundhero.jpg"
          alt="Plantation de cacao en Côte d'Ivoire"
          fill
          priority
          quality={92}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Multi-layer overlay: orange gradient that blends into the image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#1F3D2F]/85 via-[#D06B1F]/55 to-[#E8833D]/40 pointer-events-none" />

      {/* Bottom fade to cream */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #FDFBF7 0%, rgba(253,251,247,0.4) 15%, transparent 35%, transparent 100%)",
        }}
      />

      {/* Subtle vignette + grain */}
      <div className="absolute inset-0 z-10 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-0 z-10 texture-grain pointer-events-none opacity-50" />

      {/* Decorative orange orbs */}
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="absolute top-[15%] -left-32 w-[400px] h-[400px] rounded-full bg-[#F4A866]/30 blur-[100px] z-10 pointer-events-none"
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute bottom-[10%] right-[-100px] w-[340px] h-[340px] rounded-full bg-[#F2B83E]/25 blur-[100px] z-10 pointer-events-none"
            animate={{ scale: [1, 1.1, 1], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </>
      )}

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-28 pb-20"
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left column — text */}
          <motion.div
            className="lg:col-span-8 text-white"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
            }}
          >
            {/* CCC trust pill */}
            <motion.div variants={fadeUp} className="mb-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-sm font-medium shadow-lg shadow-black/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2B83E] opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2B83E]" />
                </span>
                <ShieldCheck className="w-4 h-4" />
                <span className="text-white">{t.hero.licenceBadge}</span>
              </div>
            </motion.div>

            {/* Main title */}
            <motion.h1
              variants={fadeUp}
              className="text-display font-bold mb-6 text-balance leading-[0.98]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}
            >
              <span className="whitespace-nowrap">{t.hero.taglineMain}</span>
              <span className="block mt-1">
                <span className="bg-gradient-to-r from-[#F2B83E] via-[#FFE9B0] to-[#F2B83E] bg-clip-text text-transparent">
                  {t.hero.taglineHighlight}
                </span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed text-pretty"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.25)" }}
            >
              {t.hero.description}
            </motion.p>

            {/* Quick stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-x-7 gap-y-4 mb-9">
              <StatBlock
                value={asondoData.stats.yearsExperience.toString()}
                label={t.hero.experience}
                icon={Clock}
              />
              <StatBlock value="#1" label={t.hero.statProducerWorld} icon={MapPin} />
              <StatBlock value="EUDR" label={t.hero.statEudrReady} icon={CheckCircle2} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("evidence-matrix")}
                className="group relative inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-[#D06B1F] font-semibold hover:bg-[#FEF3E7] transition-all shadow-2xl shadow-black/25 btn-premium"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("rfq-form")}
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white font-semibold hover:from-[#D06B1F] hover:to-[#A85318] transition-all shadow-2xl shadow-[#D06B1F]/40 btn-premium"
              >
                {t.hero.ctaSecondary}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right column: 3 static info cards. No animations, fixed gap. */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-5 items-end">
            {/* Card 1: Origine */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl shadow-black/30 w-full max-w-[300px] border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shrink-0 shadow-lg shadow-[#E8833D]/30">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#D06B1F] font-bold">
                    {t.hero.cards.origineLabel}
                  </div>
                  <div className="text-base font-bold text-[#1A1A1A]">
                    {t.hero.cards.origineValue}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {t.hero.cards.origineDesc}
              </p>
            </div>

            {/* Card 2: Mission */}
            <div className="bg-[#1F3D2F]/95 backdrop-blur-xl text-white rounded-2xl p-5 shadow-2xl shadow-black/30 w-full max-w-[300px] border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-[#F2B83E] font-bold mb-2">
                {t.hero.cards.missionLabel}
              </div>
              <p className="text-sm leading-relaxed">
                {t.hero.cards.missionLine1}{" "}
                <span className="text-[#F2B83E] font-semibold">
                  {t.hero.cards.missionHighlight}
                </span>
                {t.hero.cards.missionLine2}
              </p>
            </div>

            {/* Card 3: Programme */}
            <div className="bg-gradient-to-br from-[#F2B83E] to-[#D4A017] text-[#1F3D2F] rounded-2xl p-5 shadow-2xl shadow-black/30 w-full max-w-[300px] border border-white/10">
              <div className="text-3xl font-black leading-none mb-1">
                {asondoData.pillars.reduce((acc, p) => acc + p.items.length, 0)}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider">
                {t.hero.cards.programmeLabel}
              </div>
              <div className="text-[11px] mt-1 opacity-85">
                {t.hero.cards.programmeDesc}
              </div>
            </div>
          </div>
        </div>

        {/* Industry alignment row - BIGGER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="mt-14 pt-8 border-t border-white/20"
        >
          <IndustryAlignment variant="dark" size="lg" />
        </motion.div>
      </motion.div>

    </section>
  );
}

function StatBlock({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold leading-none text-white">{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-white/80 mt-1 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}

