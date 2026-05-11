"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings as SettingsIcon,
  ExternalLink,
} from "lucide-react";
import { AsondoLogo } from "@/app/components/AsondoLogo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
}

const NAV: NavItem[] = [
  { href: "/console", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/console/rfq", label: "RFQ & Leads", icon: FileText, matchPrefix: true },
  { href: "/console/settings", label: "Paramètres", icon: SettingsIcon, matchPrefix: true },
];

export function ConsoleSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-gradient-to-b from-[#1A1A1A] via-[#2A1810] to-[#1A1A1A] text-white border-r border-white/5 z-30">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/console" className="block">
          <AsondoLogo variant="full" size="md" color="white" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
            Console CEO
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = item.matchPrefix
            ? pathname.startsWith(item.href)
            : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              /*
               * Force prefetch on dynamic console routes: the dashboard,
               * RFQ list and settings pages are all `dynamic = "force-
               * dynamic"`, so Next.js won't prefetch them by default.
               * Setting prefetch={true} downloads the route chunks as
               * soon as the link enters the viewport, which makes the
               * post-login navigation between dashboard / RFQ / settings
               * feel near-instant during the CEO demo.
               */
              prefetch
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white shadow-lg shadow-[#E8833D]/20"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer link back to public site */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Voir le site public
        </Link>
      </div>
    </aside>
  );
}
