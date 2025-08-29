# Workkerz.com – Survey + Admin (Next.js App Router)

A production-ready Next.js project with Tailwind CSS, Supabase persistence, an Onboarding survey, and a protected Admin Dashboard.

## Quick Start

```bash
pnpm i   # or npm i / yarn
cp .env.example .env.local
pnpm dev
```

### Required Env
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, for dashboard reads)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `ADMIN_TOKEN` (long random string)

### Supabase SQL
Run this in Supabase SQL editor:

# Supabase SQL (run in SQL editor)

-- Enable pgcrypto (for gen_random_uuid) if not enabled
create extension if not exists pgcrypto;

create table if not exists public.worker_surveys (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text,
  phone text,
  q3 text,
  q4 text,
  q5 text,
  q6 text[],
  q7 text[],
  q8 text,
  q9 text,
  q10 text,
  q11 text
);

alter table worker_surveys enable row level security;

-- Allow anonymous inserts for the survey
create policy insert_surveys on worker_surveys
for insert to anon
using (true) with check (true);

-- Prevent selects by anon (dashboard uses service role)
create policy no_select on worker_surveys
for select
using (false);



### Routes
- `/` – Landing
- `/onboarding` – Worker survey
- `/admin/login` – Admin login
- `/admin/dashboard` – Protected dashboard

