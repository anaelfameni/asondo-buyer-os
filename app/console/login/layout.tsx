/**
 * Layout for /console/login.
 * Renders a minimal centered page (no sidebar, no marketing chrome).
 * Auth check is intentionally NOT performed here — the login form has to
 * stay reachable for unauthenticated visitors.
 */
export default function ConsoleLoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1A1A1A] via-[#2A1810] to-[#4A2818] flex items-center justify-center p-6">
      {children}
    </div>
  );
}
