import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./sections/Footer";
import { I18nProvider } from "@/lib/i18n-context";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Asondo, Votre Exportateur de Cacao Ivoirien | EUDR-Ready",
  description: "Asondo : votre exportateur de cacao ivoirien. Engagés pour une filière durable et compétitive. 15 ans d'expérience, lien direct avec les coopératives de petits producteurs, traçabilité complète et conformité EUDR.",
  keywords: ["cacao", "cocoa", "Côte d'Ivoire", "Asondo", "EUDR", "exportateur", "traçabilité", "durable", "CCC", "Abidjan", "fèves de cacao"],
  authors: [{ name: "Asondo" }],
  metadataBase: new URL("https://asondo.ci"),
  openGraph: {
    title: "Asondo, Votre Exportateur de Cacao Ivoirien",
    description: "Cacao ivoirien traçable et durable, en lien direct avec les coopératives de petits producteurs. Conformité EUDR.",
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "Asondo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asondo, Votre Exportateur de Cacao Ivoirien",
    description: "Cacao ivoirien traçable et durable. EUDR-Ready.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-[#FDFBF7] text-[#1A1A1A]`}>
        <I18nProvider>
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
