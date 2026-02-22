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
