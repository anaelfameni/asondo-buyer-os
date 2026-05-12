import { HeroBanner } from "@/app/sections/HeroBanner";
import { EvidenceMatrix } from "@/app/sections/EvidenceMatrix";
import { SupplyMap } from "@/app/sections/SupplyMap";
import { ProgrammeDashboard } from "@/app/sections/ProgrammeDashboard";
import { AICopilot } from "@/app/sections/AICopilot";
import { SamplePackCTA } from "@/app/sections/SamplePackCTA";
import { HomeRFQTeaser } from "@/app/sections/HomeRFQTeaser";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <EvidenceMatrix />
      <SupplyMap />
      <ProgrammeDashboard />
      {/*
       * SamplePackCTA (Buyer Assurance Pack download) intentionally
       * sits BEFORE the AI assistant. A buyer who has just scrolled
       * through the Evidence Matrix and the programme is at peak
       * conversion intent — we want the big orange PDF button in
       * view before we offer the Q&A fallback.
       */}
      <SamplePackCTA />
      <AICopilot />
      {/* Homepage RFQ teaser. The actual form lives on /contact only. */}
      <HomeRFQTeaser />
    </main>
  );
}
