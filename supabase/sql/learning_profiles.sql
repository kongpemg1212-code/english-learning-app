create table if not exists public.learning_profiles (
  profile_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_profiles disable row level security;

grant select, insert, update on table public.learning_profiles to anon;
grant select, insert, update on table public.learning_profiles to authenticated;
