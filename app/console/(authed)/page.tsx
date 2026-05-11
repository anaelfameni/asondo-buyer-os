import Link from "next/link";
import { FileText, TrendingUp, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { readSettings } from "@/lib/settings-store";
import { computeReadiness } from "@/lib/readiness-score";
import { countLeadsByStatus, listLeads } from "@/lib/rfq-store";
import { BuyerReadinessScore } from "@/app/components/console/BuyerReadinessScore";

// Always re-fetch on each request — these are dynamic dashboard numbers.
export const dynamic = "force-dynamic";

export default async function ConsoleDashboardPage() {
  const [settings, counts, leads] = await Promise.all([
    readSettings(),
    countLeadsByStatus(),
    listLeads(),
  ]);
  const summary = computeReadiness(settings.readinessFlags);

  const totalLeads = leads.length;
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Readiness Score widget */}
      <BuyerReadinessScore summary={summary} />

      {/* KPI grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={FileText}
          label="Leads RFQ totaux"
          value={totalLeads}
          tone="neutral"
        />
        <KpiCard
          icon={TrendingUp}
          label="Nouveaux (à traiter)"
          value={counts.new}
          tone="warn"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Gagnés"
          value={counts.closed_won}
          tone="ok"
        />
        <KpiCard
          icon={XCircle}
          label="Perdus"
          value={counts.closed_lost}
          tone="bad"
        />
      </section>

      {/* Recent leads */}
      <section className="bg-white rounded-2xl border border-[#E8833D]/10 shadow-sm overflow-hidden">
        <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E8833D]/10">
          <div>
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Leads récents
            </h2>
            <p className="text-xs text-[#6B7280]">
              Les 5 derniers RFQ soumis depuis le site public.
            </p>
          </div>
          <Link
            href="/console/rfq"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#D06B1F] hover:text-[#E8833D]"
          >
            Voir tout
            <ArrowRight className="w-3 h-3" />
          </Link>
        </header>
        {recentLeads.length === 0 ? (
          <p className="px-5 sm:px-6 py-12 text-center text-sm text-[#6B7280]">
            Aucun lead pour l&apos;instant. Les soumissions du formulaire RFQ public
            apparaîtront ici.
          </p>
        ) : (
          <ul className="divide-y divide-[#E8833D]/5">
            {recentLeads.map((l) => (
              <li
                key={l.id}
                className="px-5 sm:px-6 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {l.company || "—"}{" "}
                    <span className="text-[#6B7280] font-normal">
                      · {l.name}
                    </span>
                  </p>
                  <p className="text-xs text-[#6B7280] truncate">
                    {l.email} · {l.country}
                    {l.volume ? ` · ${l.volume} t` : ""}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#6B7280] flex-shrink-0">
                  {l.reference}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "neutral" | "warn" | "ok" | "bad";
}) {
  const toneClasses: Record<typeof tone, string> = {
    neutral: "from-[#E8833D]/10 to-[#D06B1F]/5 text-[#D06B1F]",
    warn: "from-amber-100 to-amber-50 text-amber-700",
    ok: "from-green-100 to-green-50 text-green-700",
    bad: "from-red-100 to-red-50 text-red-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-[#E8833D]/10 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
          {label}
        </p>
        <div
          className={`p-2 rounded-lg bg-gradient-to-br ${toneClasses[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1A1A1A] leading-none">{value}</p>
    </div>
  );
}
