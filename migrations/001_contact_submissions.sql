-- Run this once in the Supabase SQL editor for project `uflkltmvzvhziysheccd`.
-- It creates the contact_submissions table used by /api/contact and /admin/contacts/.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  message     text not null,
  ip          text,
  user_agent  text
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Anonymous form submissions can INSERT only. No SELECT/UPDATE/DELETE from anon.
drop policy if exists "anon can insert contact" on public.contact_submissions;
create policy "anon can insert contact"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- Service role (used by the admin endpoint) implicitly bypasses RLS.
