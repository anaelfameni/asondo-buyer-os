# Supabase setup — Asondo Buyer OS

This site uses Supabase Postgres to persist **demandes de devis** (RFQ
leads). Without Supabase, leads are written to a local JSON file that
Vercel wipes on every cold start, which is why the CEO console showed
an empty pipeline on production even after buyers submitted the form.

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

### 2. Run the migration

1. Open the new project, go to **SQL Editor → New query**.
2. Paste the full contents of `supabase/migrations/0001_rfq_leads.sql`
   from this repo.
3. Click **Run**. You should see "Success. No rows returned".
4. Sanity check: open **Table editor**, you should see a new
   `rfq_leads` table with no rows yet.

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

1. Submit a test RFQ on the public site (any page with the RFQ form,
   or `/contact`).
2. Open Supabase **Table editor → rfq_leads**: one row should appear.
3. Open `/console/login`, sign in with `Asondo2026!`, go to
   `/console/rfq`: the same lead should be listed with status `new`.

## How the code picks Supabase vs file

See `lib/rfq-store.ts`. The four functions (`listLeads`, `createLead`,
`updateLead`, `countLeadsByStatus`) check `isSupabaseConfigured()` on
every call. If both env vars are present, they delegate to
`lib/rfq-store-supabase.ts` which talks to the PostgREST endpoint via
plain `fetch`. Otherwise, they fall back to the JSON file in
`data/rfq-leads.json`. No extra npm dependency is needed.
