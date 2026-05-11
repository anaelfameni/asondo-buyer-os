"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  Mail,
} from "lucide-react";
import {
  READINESS_KEYS,
  READINESS_LABELS_FR,
  ReadinessFlags,
  computeReadiness,
} from "@/lib/readiness-score";
import type {
  ConsoleSettings,
  CustomCertification,
} from "@/lib/settings-store";

/**
 * Generate a stable id for new custom-certification rows.
 *
 * `crypto.randomUUID` exists everywhere we run (modern browsers + Node
 * 19+) but we guard against the rare case of an older runtime to keep
 * the demo robust without a polyfill.
 */
function newCertId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface Props {
  initialSettings: ConsoleSettings;
}

export function SettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState<ConsoleSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const summary = computeReadiness(settings.readinessFlags);

  function setFlag(k: keyof ReadinessFlags, value: boolean) {
    setSettings((prev) => ({
      ...prev,
      readinessFlags: { ...prev.readinessFlags, [k]: value },
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        settings?: ConsoleSettings;
      };
      if (!res.ok || !data.ok || !data.settings) {
        toast.error("Échec de l'enregistrement");
        return;
      }
      startTransition(() => setSettings(data.settings!));
      toast.success("Paramètres enregistrés");
    } catch {
      toast.error("Réseau indisponible");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-4xl">
      {/* Section: Readiness flags */}
      <Card
        title="Critères Buyer Readiness"
        icon={ShieldCheck}
        subtitle={`Cochez les preuves disponibles. Score actuel : ${summary.score}/100.`}
      >
        <ul className="space-y-3">
          {READINESS_KEYS.map((k) => (
            <li key={k}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.readinessFlags[k]}
                  onChange={(e) => setFlag(k, e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-[#E8833D]/30 text-[#E8833D] focus:ring-[#E8833D] focus:ring-offset-0"
                />
                <span className="text-sm">
                  <span className="font-medium text-[#1A1A1A] block">
                    {READINESS_LABELS_FR[k]}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    {hint(k)}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      {/* Section: Contact */}
      <Card title="Contact CEO" icon={UserIcon}>
        <Field label="Nom" icon={UserIcon}>
          <input
            value={settings.contact.name}
            onChange={(e) =>
              setSettings({
                ...settings,
                contact: { ...settings.contact, name: e.target.value },
              })
            }
            className={inputCls}
            placeholder="Nom complet"
          />
        </Field>
        <Field label="Email" icon={Mail}>
          <input
            type="email"
            value={settings.contact.email}
            onChange={(e) =>
              setSettings({
                ...settings,
                contact: { ...settings.contact, email: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Téléphone" icon={Phone}>
          <input
            value={settings.contact.phone}
            onChange={(e) =>
              setSettings({
                ...settings,
                contact: { ...settings.contact, phone: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
      </Card>

      {/* Section: Geolocation */}
      <Card title="Géolocalisation" icon={MapPin}>
        <Field label="Couverture GPS (%)">
          <input
            type="number"
            min={0}
            max={100}
            value={settings.geolocation.coveragePct}
            onChange={(e) =>
              setSettings({
                ...settings,
                geolocation: {
                  ...settings.geolocation,
                  coveragePct: Math.min(
                    100,
                    Math.max(0, Number(e.target.value) || 0)
                  ),
                },
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Notes internes">
          <textarea
            rows={3}
            value={settings.geolocation.notes}
            onChange={(e) =>
              setSettings({
                ...settings,
                geolocation: {
                  ...settings.geolocation,
                  notes: e.target.value,
                },
              })
            }
            className={`${inputCls} resize-y`}
            placeholder="Statut de l'enrôlement SNTCC, partenaires terrain, etc."
          />
        </Field>
      </Card>

      {/* Section: Certificates */}
      <Card title="Certifications" icon={CheckCircle2}>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.certificates.cccLicenceActive}
            onChange={(e) =>
              setSettings({
                ...settings,
                certificates: {
                  ...settings.certificates,
                  cccLicenceActive: e.target.checked,
                },
              })
            }
            className="w-4 h-4 rounded border-[#E8833D]/30 text-[#E8833D] focus:ring-[#E8833D]"
          />
          <span className="text-sm font-medium text-[#1A1A1A]">
            Licence CCC active (2025/26)
          </span>
        </label>
        <Field label="Statut Rainforest Alliance">
          <select
            value={settings.certificates.rainforestStatus}
            onChange={(e) =>
              setSettings({
                ...settings,
                certificates: {
                  ...settings.certificates,
                  rainforestStatus: e.target
                    .value as ConsoleSettings["certificates"]["rainforestStatus"],
                },
              })
            }
            className={inputCls}
          >
            <option value="none">Aucun</option>
            <option value="in_progress">En cours</option>
            <option value="certified">Certifié</option>
          </select>
        </Field>
        <Field label="Autres certifications (note libre)">
          <input
            value={settings.certificates.other}
            onChange={(e) =>
              setSettings({
                ...settings,
                certificates: {
                  ...settings.certificates,
                  other: e.target.value,
                },
              })
            }
            className={inputCls}
            placeholder="FCC, UTZ, autres tiers…"
          />
        </Field>

        {/*
         * Structured list of additional certifications. Each row is an
         * editable triplet (nom, statut, date d'expiration) and can be
         * removed independently. Saved as a JSON array in
         * data/settings.json via the existing /api/admin/settings PATCH
         * route.
         */}
        <CustomCertificationsField
          list={settings.certificates.customList ?? []}
          onChange={(next) =>
            setSettings({
              ...settings,
              certificates: { ...settings.certificates, customList: next },
            })
          }
        />
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 bg-white/95 backdrop-blur border border-[#E8833D]/15 rounded-2xl p-3 shadow-xl">
        <p className="text-xs text-[#6B7280] mr-auto">
          Dernière sauvegarde&nbsp;:{" "}
          {settings.updatedAt.startsWith("1970")
            ? "jamais"
            : new Date(settings.updatedAt).toLocaleString("fr-FR")}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white font-semibold shadow-lg shadow-[#E8833D]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
      </div>
    </form>
  );
}

/* ----------------------------------- Custom certifications list field */

function CustomCertificationsField({
  list,
  onChange,
}: {
  list: CustomCertification[];
  onChange: (next: CustomCertification[]) => void;
}) {
  const updateRow = (id: string, patch: Partial<CustomCertification>) => {
    onChange(list.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };
  const removeRow = (id: string) => {
    onChange(list.filter((row) => row.id !== id));
  };
  const addRow = () => {
    onChange([
      ...list,
      { id: newCertId(), name: "", status: "in_progress", expiresAt: "" },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280] flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-[#E8833D]" />
          Certifications personnalisées
        </span>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D06B1F] bg-[#E8833D]/10 hover:bg-[#E8833D]/15 border border-[#E8833D]/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-[#6B7280] italic px-3 py-3 rounded-lg bg-[#FDFBF7] border border-dashed border-[#E8833D]/20">
          Aucune certification personnalisée. Cliquez sur
          <span className="mx-1 font-semibold text-[#D06B1F]">Ajouter</span>
          pour créer une nouvelle ligne (FCC, UTZ, ISO 22000, etc.).
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((row) => (
            <li
              key={row.id}
              className="grid grid-cols-12 gap-2 items-start p-3 rounded-xl bg-[#FDFBF7] border border-[#E8833D]/15"
            >
              <input
                value={row.name}
                onChange={(e) => updateRow(row.id, { name: e.target.value })}
                className={`${inputCls} col-span-12 sm:col-span-5 h-10`}
                placeholder="Nom (ex. ISO 22000)"
                aria-label="Nom de la certification"
              />
              <select
                value={row.status}
                onChange={(e) =>
                  updateRow(row.id, {
                    status: e.target.value as CustomCertification["status"],
                  })
                }
                className={`${inputCls} col-span-7 sm:col-span-3 h-10`}
                aria-label="Statut"
              >
                <option value="active">Active</option>
                <option value="in_progress">En cours</option>
                <option value="pending">En attente</option>
              </select>
              <input
                type="date"
                value={row.expiresAt}
                onChange={(e) =>
                  updateRow(row.id, { expiresAt: e.target.value })
                }
                className={`${inputCls} col-span-4 sm:col-span-3 h-10`}
                aria-label="Date d'expiration"
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="col-span-1 h-10 w-10 inline-flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Supprimer la certification"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------ small atoms --- */

const inputCls =
  "w-full h-11 px-3 rounded-xl bg-white border border-[#E8833D]/15 focus:border-[#E8833D] focus:ring-2 focus:ring-[#E8833D]/20 outline-none text-sm transition-colors";

function Card({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-[#E8833D]/10 shadow-sm p-6">
      <header className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#E8833D]/15 to-[#D06B1F]/10 text-[#D06B1F]">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A]">{title}</h2>
          {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-[#E8833D]" />}
        {label}
      </span>
      {children}
    </label>
  );
}

function hint(k: keyof ReadinessFlags): string {
  switch (k) {
    case "geolocation":
      return "Coordonnées GPS collectées pour chaque parcelle (via SNTCC ou OCS).";
    case "certificates":
      return "Licence CCC active + au moins un standard tiers (Rainforest, UTZ…).";
    case "chainOfCustody":
      return "Traçabilité documentée coopérative → siège → port d'expédition.";
    case "grievanceMechanism":
      return "Mécanisme documenté pour les plaintes producteurs/communautés.";
  }
}
