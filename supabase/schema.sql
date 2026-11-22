-- Chạy toàn bộ file này trong Supabase > SQL Editor
create table if not exists admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

create table if not exists profile (
  id int primary key default 1 check (id = 1),
  name text not null default 'Your Name',
  headline text not null default 'Full-stack developer & game developer',
  bio text not null default '',
  github_url text, linkedin_url text, email text, cv_url text
);
insert into profile (id) values (1) on conflict do nothing;

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('project','game')),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  body text not null default '',
  tech text[] not null default '{}',
  cover_url text, link_url text, repo_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);
create index if not exists entries_kind_status on entries (kind, status, created_at desc);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null, name text not null
);

alter table admins enable row level security;
alter table profile enable row level security;
alter table entries enable row level security;
alter table skills enable row level security;

create policy "public read profile" on profile for select using (true);
create policy "admin write profile" on profile for all using (is_admin()) with check (is_admin());
create policy "public read published" on entries for select using (status = 'published' or is_admin());
create policy "admin write entries" on entries for all using (is_admin()) with check (is_admin());
create policy "public read skills" on skills for select using (true);
create policy "admin write skills" on skills for all using (is_admin()) with check (is_admin());

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects for all
  using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());

-- Sau khi tạo user admin ở Authentication > Users, chạy (thay email):
-- insert into admins (user_id) select id from auth.users where email = 'you@example.com';
