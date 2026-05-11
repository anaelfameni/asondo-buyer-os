import { listLeads, countLeadsByStatus } from "@/lib/rfq-store";
import { RFQTable } from "@/app/components/console/RFQTable";

export const dynamic = "force-dynamic";

export default async function ConsoleRfqPage() {
  const [leads, counts] = await Promise.all([
    listLeads(),
    countLeadsByStatus(),
  ]);

  return <RFQTable initialLeads={leads} initialCounts={counts} />;
}
