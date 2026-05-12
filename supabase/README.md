# Supabase setup — Asondo Buyer OS

This site uses Supabase Postgres to persist two pieces of state that
must survive serverless cold starts:

1. **Demandes de devis** (RFQ leads) — table `rfq_leads`.
2. **CEO console settings** (readiness flags, contact info,
   geolocation coverage, certifications) — table
   `console_settings_kv`.

Without Supabase, both are written to local JSON files
(`data/rfq-leads.json`, `data/settings.json`) that Vercel wipes on
every cold start and won't even allow writes to in production (the
serverless filesystem is read-only). That's why the CEO console
showed an empty RFQ pipeline and the **Enregistrer** button on
`/console/settings` silently failed on production before this setup.

## One-time setup (5 minutes)

### 1. Create the Supabase project

1. Go to <https://supabase.com> and sign in (free, no card required).
2. Click **New project**.
3. Pick the **Frankfurt (eu-central-1)** region — closest to Côte
   d'Ivoire customers and to Vercel's IAD edge nodes.
4. Choose a strong database password and **save it in 1Password / a
   password manager**. You won't need it day-to-day, but Supabase
   makes you set one.
5. Wait ~2 minutes for the project to spin up.

### 2. Run the migrations

Open the new project and go to **SQL Editor → New query**, then run
each migration once (they're idempotent so re-running is safe):

1. Paste the contents of `supabase/migrations/0001_rfq_leads.sql`,
   click **Run**, expect "Success. No rows returned".
2. Paste the contents of `supabase/migrations/0002_console_settings.sql`,
   click **Run**, same expected result.

Sanity check: open **Table editor**, you should see two new tables —
`rfq_leads` and `console_settings_kv` — both empty.

### 3. Copy the two secrets you need

In **Project Settings → API**:

| Field | Where to use it |
|---|---|
| **Project URL** (e.g. `https://abcd1234.supabase.co`) | `SUPABASE_URL` |
| **service_role secret** (under "Project API keys", click reveal) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **Never** copy the `anon` key for this project. It is intended for
> public client-side use and would expose the leads table to anyone who
> opens DevTools. The service-role key is server-only.

### 4. Set the env vars on Vercel

1. Open <https://vercel.com/dashboard> → project **asondo-buyer-os**.
2. **Settings → Environment Variables**.
3. Add the two variables for **Production, Preview, Development**:

   - `SUPABASE_URL` = the project URL from step 3
   - `SUPABASE_SERVICE_ROLE_KEY` = the service_role secret from step 3

4. **Deployments → … → Redeploy** the latest deployment. Make sure
   "Use existing Build Cache" is **unchecked** so the new env vars are
   picked up.

### 5. Set the env vars locally (optional)

If you want `pnpm dev` to write to Supabase too (instead of the local
JSON file), add the same two variables to `.env.local`:

```
SUPABASE_URL=https://abcd1234.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ey...
```

Restart the dev server. New leads submitted on `http://localhost:3000`
will now land in Supabase, visible immediately in the CEO console at
`/console/rfq` whether you visit it locally or on production.

## Verify

### RFQ pipeline

1. Submit a test RFQ on the public site (any page with the RFQ form,
   or `/contact`).
2. Open Supabase **Table editor → rfq_leads**: one row should appear.
3. Open `/console/login`, sign in with `Asondo2026!`, go to
   `/console/rfq`: the same lead should be listed with status `new`.

### CEO console settings

1. Open `/console/login` on production, sign in.
2. Go to `/console/settings`, change anything (e.g. tick a readiness
   flag or edit the CEO phone), click **Enregistrer**.
3. You should see the toast **"Paramètres enregistrés"**.
4. Open Supabase **Table editor → console_settings_kv**: one row
   with `key = console_settings` should appear, with the full JSON
   blob in the `data` column.
5. Refresh `/console/settings` — your change must persist.

## How the code picks Supabase vs file

See `lib/rfq-store.ts` and `lib/settings-store.ts`. Each public
function checks `isSupabaseConfigured()` / `isSupabaseSettingsConfigured()`
on every call. If both env vars are present, it delegates to
`lib/rfq-store-supabase.ts` / `lib/settings-store-supabase.ts` which
talk to the PostgREST endpoint via plain `fetch`. Otherwise, it falls
back to the JSON file in `data/rfq-leads.json` / `data/settings.json`.
No extra npm dependency is needed.
