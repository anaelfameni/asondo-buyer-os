"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AsondoLogo } from "@/app/components/AsondoLogo";

/**
 * Next.js 14 · App Router static generation fails if a Client
 * Component reads `useSearchParams()` outside a Suspense boundary
 * (it forces CSR bailout). We wrap the inner form in <Suspense> so
 * the build can prerender the shell and hydrate the form client-side.
 */
export default function ConsoleLoginPage() {
  return (
    <Suspense fallback={<LoginShellFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginShellFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/console";

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success("Connexion réussie");
        /*
         * Full-page navigation instead of router.replace + router.refresh.
         *
         * router.refresh() forces a full Server Component revalidation
         * of every segment around the destination route (the dashboard,
         * its readSettings/countLeadsByStatus/listLeads queries, etc.),
         * which is what made the post-login transition feel slow during
         * the CEO walk-through. window.location.assign triggers a single
         * native nav: the middleware sees the freshly-set session cookie
         * and the destination renders once, server-side, end-to-end.
         */
        window.location.assign(from);
        return;
      }

      if (res.status === 401) {
        setError("Mot de passe incorrect.");
      } else if (res.status === 500) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (data.error === "console_not_configured") {
          setError(
            "Console non configurée. Définissez CONSOLE_PASSWORD et CONSOLE_SESSION_SECRET dans .env.local."
          );
        } else {
          setError("Erreur serveur. Réessayez.");
        }
      } else {
        setError("Échec de la connexion. Réessayez.");
      }
    } catch {
      setError("Réseau indisponible. Vérifiez votre connexion.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-[#E8833D]/20 to-[#D06B1F]/20 backdrop-blur border border-[#E8833D]/30 mb-6">
          <AsondoLogo variant="full" size="md" color="white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Console CEO</h1>
        <p className="text-white/60 text-sm">
          Espace privé Asondo · accès réservé
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <label className="block">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white/70 mb-3">
            <Lock className="w-3.5 h-3.5 text-[#F4A866]" />
            Mot de passe
          </span>
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            placeholder="••••••••"
            className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 focus:border-[#E8833D] focus:ring-2 focus:ring-[#E8833D]/30 outline-none text-white placeholder:text-white/30 transition-colors disabled:opacity-60"
          />
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white font-semibold shadow-lg shadow-[#E8833D]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connexion…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Se connecter
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-center text-white/40 leading-relaxed">
          Session HTTP-only · valable 7 jours. <br />
          Démo-grade : remplacer par Supabase Auth en production.
        </p>
      </form>
    </motion.div>
  );
}
