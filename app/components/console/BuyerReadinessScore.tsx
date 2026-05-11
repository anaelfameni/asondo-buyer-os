"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  READINESS_KEYS,
  READINESS_LABELS_FR,
  READINESS_THEME,
  ReadinessSummary,
} from "@/lib/readiness-score";

interface Props {
  summary: ReadinessSummary;
}

/**
 * Hero widget for /console.
 * Visualises the 3-state Buyer Readiness Score with a progress ring,
 * the list of completed/missing items, and a CTA to /console/settings.
 */
export function BuyerReadinessScore({ summary }: Props) {
  const theme = READINESS_THEME[summary.level];
  const Icon =
    summary.level === "ready"
      ? CheckCircle2
      : summary.level === "almost_ready"
        ? AlertTriangle
        : XCircle;

  // SVG ring geometry
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - summary.score / 100);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E8833D]/15 shadow-xl shadow-[#E8833D]/5">
      {/* Decorative gradient */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${theme.bg}, transparent 60%)`,
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[auto,1fr,auto] items-center p-6 sm:p-8">
        {/* Ring */}
        <div className="flex items-center gap-5">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 160 160"
              aria-hidden
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#F3F4F6"
                strokeWidth="14"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke={theme.ring}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl font-bold leading-none"
                style={{ color: theme.color }}
              >
                {summary.score}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#6B7280] mt-1">
                / 100
              </span>
            </div>
          </div>

          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2"
              style={{ background: theme.bg, color: theme.color }}
            >
              <Icon className="w-3.5 h-3.5" />
              {theme.labelFr}
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">
              Buyer Readiness Score
            </h2>
            <p className="text-sm text-[#6B7280] max-w-xs">
              {summary.completed} sur {summary.total} critères EUDR validés.
            </p>
          </div>
        </div>

        {/* Item list */}
        <ul className="space-y-2 lg:border-l lg:border-[#E8833D]/10 lg:pl-8">
          {READINESS_KEYS.map((k) => {
            const ok = summary.flags[k];
            return (
              <li key={k} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 inline-flex w-5 h-5 rounded-full items-center justify-center flex-shrink-0 ${
                    ok
                      ? "bg-green-100 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </span>
                <span
                  className={
                    ok ? "text-[#1A1A1A]" : "text-[#6B7280] line-through"
                  }
                >
                  {READINESS_LABELS_FR[k]}
                </span>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link
          href="/console/settings"
          className="inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white text-sm font-semibold shadow-lg shadow-[#E8833D]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Compléter les preuves
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
