import { HeroBanner } from "./sections/HeroBanner";
import { EvidenceMatrix } from "./sections/EvidenceMatrix";
import { SupplyMap } from "./sections/SupplyMap";
import { ProgrammeDashboard } from "./sections/ProgrammeDashboard";
import { AICopilot } from "./sections/AICopilot";
import { SamplePackCTA } from "./sections/SamplePackCTA";
import { RFQForm } from "./sections/RFQForm";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <EvidenceMatrix />
      <SupplyMap />
      <ProgrammeDashboard />
      <AICopilot />
      <SamplePackCTA />
      <RFQForm />
    </main>
  );
}
