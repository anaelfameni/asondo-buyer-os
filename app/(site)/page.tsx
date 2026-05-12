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
       * Order matters here: the Buyer Assurance Pack sample lives
       * directly above the AI Copilot. The sample acts as the
       * "show me the proof" hand-off, the AI copilot then answers
       * any follow-up question the buyer might still have. Swapping
       * them used to bury the PDF under the chat and lost half the
       * downloads.
       */}
      <SamplePackCTA />
      <AICopilot />
      {/* Homepage RFQ teaser. The actual form lives on /contact only. */}
      <HomeRFQTeaser />
    </main>
  );
}
