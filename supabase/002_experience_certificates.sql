-- Chạy file này trong Supabase > SQL Editor (sau schema.sql)
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  start_date date not null,
  end_date date,                       -- null = đang làm
  description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists experience_start on experience (start_date desc);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on date,
  credential_url text,
  image_url text,
  created_at timestamptz not null default now()
);
create index if not exists certificates_issued on certificates (issued_on desc);

alter table experience enable row level security;
alter table certificates enable row level security;
create policy "public read experience" on experience for select using (true);
create policy "admin write experience" on experience for all using (is_admin()) with check (is_admin());
create policy "public read certificates" on certificates for select using (true);
create policy "admin write certificates" on certificates for all using (is_admin()) with check (is_admin());
