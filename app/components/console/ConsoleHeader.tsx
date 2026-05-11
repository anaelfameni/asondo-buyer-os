"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LogOut, ShieldCheck } from "lucide-react";

const TITLES: Record<string, string> = {
  "/console": "Tableau de bord",
  "/console/rfq": "RFQ & Leads",
  "/console/settings": "Paramètres",
};

function titleForPath(pathname: string): string {
  // Exact first
  if (TITLES[pathname]) return TITLES[pathname];
  // Prefix fallback (e.g. /console/rfq/123)
  const match = Object.keys(TITLES)
    .filter((k) => k !== "/console")
    .find((k) => pathname.startsWith(k));
  return match ? TITLES[match] : "Console CEO";
}

export function ConsoleHeader() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore network errors; the cookie still expires.
    }
    toast.success("Déconnecté");
    router.replace("/console/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8833D]/10 px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#1A1A1A]">
          {titleForPath(pathname)}
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-[#E8833D]" />
          Espace privé Asondo · session sécurisée
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#1A1A1A] bg-white border border-[#E8833D]/20 hover:border-[#E8833D] hover:bg-[#FEF3E7] transition-colors shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Déconnexion
      </button>
    </header>
  );
}
