-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create scans table to store vulnerability scan results
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  status text not null check (status in ('pending', 'scanning', 'completed', 'failed')),
  vulnerabilities jsonb,
  ai_summary text,
  scan_duration integer,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

alter table public.scans enable row level security;

-- RLS policies for scans
create policy "scans_select_own"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "scans_insert_own"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "scans_update_own"
  on public.scans for update
  using (auth.uid() = user_id);

create policy "scans_delete_own"
  on public.scans for delete
  using (auth.uid() = user_id);
