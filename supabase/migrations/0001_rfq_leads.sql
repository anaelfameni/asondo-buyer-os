-- Asondo RFQ leads — 1st migration.
--
-- Run this once on your Supabase project (SQL editor → New query →
-- paste → Run). Idempotent: safe to re-run, won't drop existing rows.
--
-- After running this you must set the following environment variables
-- on Vercel (Project → Settings → Environment Variables) AND in
-- `.env.local` for local development:
--
--   SUPABASE_URL                 https://<project-ref>.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY    (Project settings → API → service_role secret)
--
-- The service_role key MUST stay server-only. Never expose it to the
-- browser. Vercel's "Environment Variables" UI keeps it scoped to the
-- server runtime, which is what we need — `lib/rfq-store-supabase.ts`
-- reads it through `process.env.*` from a server module.
--
-- Schema notes
-- ------------
-- * `id` is a UUID generated client-side at insert time (the Node
--   crypto.randomUUID() call already used by the legacy file store).
--   We don't use `default gen_random_uuid()` so insert payloads keep
--   the same shape between the two backends.
-- * `reference` is the buyer-facing short ID (`RFQ-XXXXXX`). Indexed
--   for fast lookup from the CEO console.
-- * `status` is constrained to the four states already used in code.
-- * RLS is enabled and *no policies* are created — only the service
--   role (which bypasses RLS) can read/write. That's intentional:
--   leads are private to Asondo internal staff.

create extension if not exists "pgcrypto";

create table if not exists public.rfq_leads (
  id          uuid        primary key default gen_random_uuid(),
  reference   text        not null,
  status      text        not null default 'new'
                          check (status in ('new', 'in_progress', 'closed_won', 'closed_lost')),
  notes       text        not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text        not null,
  email       text        not null,
  company     text        not null,
  country     text        not null,
  volume      text        null,
  port        text        null,
  message     text        null
);

-- Unique reference so the buyer-facing short ID never collides.
create unique index if not exists rfq_leads_reference_key
  on public.rfq_leads (reference);

-- Filter the inbox by status in the CEO console, sort by recency.
create index if not exists rfq_leads_status_created_at_idx
  on public.rfq_leads (status, created_at desc);

create index if not exists rfq_leads_created_at_idx
  on public.rfq_leads (created_at desc);

-- Lock the table from anonymous / authenticated roles. The service
-- role key bypasses RLS, so the application keeps working.
alter table public.rfq_leads enable row level security;

-- Auto-bump updated_at on every UPDATE so the CEO console can sort
-- by "last touched" without us having to remember to set it.
create or replace function public.rfq_leads_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists rfq_leads_touch_updated_at on public.rfq_leads;
create trigger rfq_leads_touch_updated_at
  before update on public.rfq_leads
  for each row execute procedure public.rfq_leads_touch_updated_at();
