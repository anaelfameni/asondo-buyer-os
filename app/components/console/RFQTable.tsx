"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Mail,
  MessageSquare,
  Search,
} from "lucide-react";
import { RFQ_STATUSES, type RfqLead, type RfqStatus } from "@/lib/rfq-types";

interface Props {
  initialLeads: RfqLead[];
  initialCounts: Record<RfqStatus, number>;
}

const STATUS_LABELS: Record<RfqStatus, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  closed_won: "Gagné",
  closed_lost: "Perdu",
};

const STATUS_STYLES: Record<RfqStatus, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  closed_won: "bg-green-100 text-green-800 border-green-200",
  closed_lost: "bg-red-100 text-red-800 border-red-200",
};

type FilterValue = "all" | RfqStatus;

export function RFQTable({ initialLeads, initialCounts }: Props) {
  const [leads, setLeads] = useState<RfqLead[]>(initialLeads);
  const [counts, setCounts] = useState<Record<RfqStatus, number>>(initialCounts);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!term) return true;
      return (
        l.name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term) ||
        l.country.toLowerCase().includes(term) ||
        l.reference.toLowerCase().includes(term)
      );
    });
  }, [leads, filter, search]);

  async function patchLead(
    id: string,
    patch: { status?: RfqStatus; notes?: string }
  ) {
    setPendingId(id);
    try {
      const res = await fetch("/api/admin/rfq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = (await res.json()) as { ok?: boolean; lead?: RfqLead };
      if (!res.ok || !data.ok || !data.lead) {
        toast.error("Échec de la mise à jour.");
        return;
      }
      const updated = data.lead;
      startTransition(() => {
        setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
        setCounts(recountFromLeads(
          leads.map((l) => (l.id === id ? updated : l))
        ));
      });
      toast.success("Lead mis à jour");
    } catch {
      toast.error("Réseau indisponible.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter pills + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterPill
            label={`Tous (${leads.length})`}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {RFQ_STATUSES.map((s) => (
            <FilterPill
              key={s}
              label={`${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
              active={filter === s}
              tone={s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, email, entreprise, ref…)"
            className="pl-9 pr-3 h-10 w-full sm:w-80 rounded-xl bg-white border border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-2 focus:ring-[#E8833D]/20 text-sm outline-none"
          />
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8833D]/10 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState filter={filter} search={search} totalLeads={leads.length} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FDFBF7] border-b border-[#E8833D]/10 text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Ref</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Entreprise</th>
                  <th className="px-5 py-3 font-semibold">Volume / Port</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 font-semibold text-right">Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8833D]/5">
                {filtered.map((l) => (
                  <Row
                    key={l.id}
                    lead={l}
                    open={openId === l.id}
                    pending={pendingId === l.id}
                    onToggle={() => setOpenId(openId === l.id ? null : l.id)}
                    onPatch={(patch) => patchLead(l.id, patch)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  tone,
  onClick,
}: {
  label: string;
  active: boolean;
  tone?: RfqStatus;
  onClick: () => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all";
  const inactive =
    "bg-white text-[#6B7280] border-[#E8833D]/15 hover:border-[#E8833D]/40 hover:text-[#1A1A1A]";
  const activeCls = tone
    ? `${STATUS_STYLES[tone]} ring-2 ring-offset-1 ring-[#E8833D]/30`
    : "bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white border-transparent shadow-md shadow-[#E8833D]/20";

  return (
    <button onClick={onClick} className={`${base} ${active ? activeCls : inactive}`}>
      <Filter className="w-3 h-3" />
      {label}
    </button>
  );
}

function Row({
  lead,
  open,
  pending,
  onToggle,
  onPatch,
}: {
  lead: RfqLead;
  open: boolean;
  pending: boolean;
  onToggle: () => void;
  onPatch: (p: { status?: RfqStatus; notes?: string }) => void;
}) {
  const [notes, setNotes] = useState(lead.notes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [sendingPack, setSendingPack] = useState(false);

  /**
   * Generates a Buyer Assurance Pack PDF tailored to this lead's company
   * (cover personalisation), and triggers a browser download. We always
   * use English for console-driven sends — buyer-side language is
   * usually English in B2B EU cocoa.
   */
  async function handleSendPack() {
    if (sendingPack) return;
    setSendingPack(true);
    const toastId = toast.loading("Génération du Buyer Pack…", {
      duration: 30_000,
    });
    try {
      const res = await fetch("/api/buyer-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: "en",
          buyerName: lead.company,
          email: lead.email,
          source: "console-send",
        }),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 429
            ? "Trop de générations récentes. Réessayez dans une heure."
            : "Échec de génération du PDF."
        );
      }
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const safeCompany = lead.company
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40) || "buyer";
      const filename = `Asondo-Buyer-Pack-${safeCompany}-${today}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Buyer Pack envoyé pour ${lead.company}.`, { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inattendue.", {
        id: toastId,
      });
    } finally {
      setSendingPack(false);
    }
  }

  return (
    <>
      <tr className="hover:bg-[#FDFBF7]/50 transition-colors cursor-pointer" onClick={onToggle}>
        <td className="px-5 py-3 font-mono text-[11px] text-[#6B7280] align-top">
          {lead.reference}
        </td>
        <td className="px-5 py-3 align-top">
          <p className="font-medium text-[#1A1A1A]">{lead.name}</p>
          <p className="text-xs text-[#6B7280]">{lead.email}</p>
        </td>
        <td className="px-5 py-3 align-top">
          <p className="font-medium text-[#1A1A1A]">{lead.company}</p>
          <p className="text-xs text-[#6B7280]">{lead.country}</p>
        </td>
        <td className="px-5 py-3 align-top">
          <p className="text-[#1A1A1A]">{lead.volume ? `${lead.volume} t` : "—"}</p>
          <p className="text-xs text-[#6B7280]">{lead.port || "—"}</p>
        </td>
        <td className="px-5 py-3 align-top">
          <StatusSelect
            value={lead.status}
            disabled={pending}
            onChange={(s) => onPatch({ status: s })}
          />
        </td>
        <td className="px-5 py-3 align-top text-right">
          <p className="text-xs text-[#6B7280] whitespace-nowrap">
            {formatDate(lead.createdAt)}
          </p>
          <ChevronDown
            className={`w-3 h-3 text-[#6B7280] inline-block ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {open && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={6} className="bg-[#FDFBF7]/60 border-t border-[#E8833D]/5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#6B7280] mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      Message du buyer
                    </h4>
                    <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                      {lead.message?.trim() || (
                        <span className="text-[#6B7280] italic">Pas de message.</span>
                      )}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(
                          `Asondo · Re: ${lead.reference}`
                        )}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D06B1F] hover:text-[#E8833D]"
                      >
                        <Mail className="w-3 h-3" />
                        Répondre par email
                      </a>
                      <button
                        type="button"
                        onClick={handleSendPack}
                        disabled={sendingPack}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#D06B1F] to-[#E8833D] text-white shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Générer un Buyer Pack PDF personnalisé pour ce lead"
                      >
                        {sendingPack ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        Envoyer le Buyer Pack
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#6B7280] mb-2">
                      Notes internes
                    </h4>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Suivi, prochaine action, contexte…"
                      className="w-full text-sm rounded-lg border border-[#E8833D]/15 bg-white p-2.5 focus:border-[#E8833D] focus:ring-2 focus:ring-[#E8833D]/20 outline-none resize-y"
                    />
                    <button
                      type="button"
                      disabled={savingNotes || notes === lead.notes}
                      onClick={async () => {
                        setSavingNotes(true);
                        await onPatch({ notes });
                        setSavingNotes(false);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white disabled:opacity-40"
                    >
                      {savingNotes ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : null}
                      Enregistrer les notes
                    </button>
                  </div>
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: RfqStatus;
  disabled?: boolean;
  onChange: (next: RfqStatus) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as RfqStatus)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none ${STATUS_STYLES[value]} disabled:opacity-50`}
    >
      {RFQ_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

function EmptyState({
  filter,
  search,
  totalLeads,
}: {
  filter: FilterValue;
  search: string;
  totalLeads: number;
}) {
  if (totalLeads === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-base font-medium text-[#1A1A1A] mb-2">
          Aucun lead pour l&apos;instant
        </p>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          Les soumissions du formulaire RFQ public apparaîtront ici en temps réel.
          Pour tester, remplis le formulaire sur la home page.
        </p>
      </div>
    );
  }
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-base font-medium text-[#1A1A1A] mb-2">
        Aucun lead ne correspond aux critères
      </p>
      <p className="text-sm text-[#6B7280]">
        {search ? `Recherche : "${search}". ` : ""}
        {filter !== "all" ? `Filtre : ${STATUS_LABELS[filter]}.` : ""}
      </p>
    </div>
  );
}

function recountFromLeads(leads: RfqLead[]): Record<RfqStatus, number> {
  const counts: Record<RfqStatus, number> = {
    new: 0,
    in_progress: 0,
    closed_won: 0,
    closed_lost: 0,
  };
  for (const l of leads) counts[l.status] = (counts[l.status] ?? 0) + 1;
  return counts;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
