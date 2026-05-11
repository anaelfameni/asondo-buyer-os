import { readSettings } from "@/lib/settings-store";
import { SettingsForm } from "@/app/components/console/SettingsForm";

export const dynamic = "force-dynamic";

export default async function ConsoleSettingsPage() {
  const settings = await readSettings();
  return <SettingsForm initialSettings={settings} />;
}
