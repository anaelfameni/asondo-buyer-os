import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/sections/Footer";

/**
 * Public site layout: wraps every page outside `/console/*` with the
 * marketing Navbar and Footer. Pages inside this route group inherit
 * the root <html>/<body> from `app/layout.tsx`.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
