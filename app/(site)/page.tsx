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
      <AICopilot />
      <SamplePackCTA />
      {/* Homepage RFQ teaser. The actual form lives on /contact only. */}
      <HomeRFQTeaser />
    </main>
  );
}
