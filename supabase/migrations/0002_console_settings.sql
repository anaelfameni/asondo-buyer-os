-- Asondo CEO console settings — singleton key/value table.
--
-- Run this once on your Supabase project (SQL editor → New query →
-- paste → Run). Idempotent: safe to re-run, won't drop existing rows.
--
-- Why a tiny key/value table instead of one column per setting
-- ------------------------------------------------------------
-- The CEO console settings object is a singleton (one project, one
-- row) but its shape evolves often (new readiness flag, new contact
-- field, new certification slot, …). Modeling each field as its own
-- column would force a SQL migration every time the product changes.
-- Storing the whole `ConsoleSettings` object in a single JSONB column
-- keeps the schema stable across iterations and matches how
-- `lib/settings-store.ts` already serializes the object on the
-- filesystem in the local dev backend.
--
-- Same security posture as `0001_rfq_leads.sql`: RLS enabled, no
-- policies, only the service-role key can read/write. The console
-- settings include the CEO contact info (email, phone) — not public.
--
-- After running this you must already have the following env vars set
-- on Vercel and `.env.local` (set during the RFQ migration):
--
--   SUPABASE_URL                 https://<project-ref>.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY    (Project settings → API → service_role secret)

create extension if not exists "pgcrypto";

create table if not exists public.console_settings_kv (
  key         text        primary key,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);

-- Lock the table from anonymous / authenticated roles. The service
-- role key bypasses RLS, so the application keeps working.
alter table public.console_settings_kv enable row level security;

-- Auto-bump updated_at on every UPDATE so the CEO console can show
-- "last touched" without us having to remember to set it.
create or replace function public.console_settings_kv_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists console_settings_kv_touch_updated_at
  on public.console_settings_kv;
create trigger console_settings_kv_touch_updated_at
  before update on public.console_settings_kv
  for each row execute procedure public.console_settings_kv_touch_updated_at();
