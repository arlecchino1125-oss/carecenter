# Local Supabase Setup (Docker)

This project uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env.
Use this guide to run a local Supabase stack with Docker and point the app to it.

## 1) Prerequisites

- Docker Desktop installed and running
- Node.js installed
- Supabase CLI installed

Install Supabase CLI (Windows, npm method):

```powershell
npm i -g supabase
```

Verify:

```powershell
supabase --version
docker --version
```

## 2) Initialize Supabase in this repo

From repo root:

```powershell
supabase init
```

If already initialized, continue.

## 3) Start local Supabase (Docker)

```powershell
supabase start
```

This starts the local API, DB, auth, storage, and studio using Docker containers.

## 4) Copy local API URL and anon key

Get current local status/credentials:

```powershell
supabase status
```

Set env in `.env`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<ANON_KEY_FROM_SUPABASE_STATUS>
```

## 5) Mirror cloud schema to local

If you already maintain complete migrations, run:

```powershell
supabase db reset
```

If you do not have complete migrations yet, pull from cloud once:

```powershell
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db pull
supabase db reset
```

This creates a migration from current cloud schema and applies it locally.

## 6) Add storage buckets and policies to migrations

If your app uses storage buckets, ensure bucket creation + policies are part of migrations.
You can add a new migration:

```powershell
supabase migration new storage_setup
```

Then place SQL for:

- `insert into storage.buckets (...)`
- `create policy ... on storage.objects ...`

Run:

```powershell
supabase db reset
```

## 7) Run app against local

```powershell
npm install
npm run dev
```

## 8) Switch between local and cloud safely

- Keep `.env` private (ignored by git)
- Keep `.env.example` committed with placeholders only
- For cloud use new keys from Supabase project settings

## 9) Useful local commands

```powershell
supabase start
supabase stop
supabase status
supabase db reset
```

## 10) Serve Edge Functions Locally

Your app invokes edge functions (`send-email`, `provision-auth-user`) via `supabase.functions.invoke(...)`.
Run this in a second terminal while developing:

```powershell
supabase functions serve --env-file supabase/functions/.env.local --no-verify-jwt
```

Set secrets used by current functions:

```powershell
supabase secrets set GMAIL_USER=<your_gmail_address>
supabase secrets set GMAIL_APP_PASSWORD=<your_16_char_app_password>
```

## 11) Sync Existing Accounts to Supabase Auth (One-Time Backfill)

Before enforcing strict RLS, sync existing `staff_accounts` and `students` into `auth.users`.
This avoids getting locked out during policy hardening.

After this one-time backfill, new staff accounts are auto-provisioned to `auth.users`
via the `provision-auth-user` edge function during account creation.

Local dev:

```powershell
$env:SUPABASE_URL="http://127.0.0.1:54321"
$env:SUPABASE_SERVICE_ROLE_KEY="<SECRET_FROM_supabase_status>"
npm run sync:auth-users
```

Cloud project:

```powershell
$env:SUPABASE_URL="https://<your-project-ref>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<service_role_key_from_project_settings>"
npm run sync:auth-users
```

Optional dry run:

```powershell
$env:DRY_RUN="true"
npm run sync:auth-users
```
