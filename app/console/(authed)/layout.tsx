import { redirect } from "next/navigation";
import { isAuthenticatedFromCookies } from "@/lib/auth";
import { ConsoleSidebar } from "@/app/components/console/ConsoleSidebar";
import { ConsoleHeader } from "@/app/components/console/ConsoleHeader";

/**
 * Protected layout for /console/* (excluding /console/login).
 * Renders the CEO console chrome: left sidebar, top header, content area.
 *
 * Auth is enforced TWICE for defense in depth:
 *   1) `middleware.ts` redirects unauthenticated requests to /console/login
 *   2) This server component re-checks the cookie before rendering anything
 *
 * If the middleware ever stops matching (config change, etc.), this guard
 * still protects the data.
 */
export default function ConsoleAuthedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isAuthenticatedFromCookies()) {
    redirect("/console/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1A1A1A]">
      <div className="flex">
        <ConsoleSidebar />
        <div className="flex-1 lg:ml-64 min-w-0">
          <ConsoleHeader />
          <main className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
