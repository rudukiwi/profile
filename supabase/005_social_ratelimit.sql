-- Chạy file này trong Supabase > SQL Editor (sau 004)
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);
alter table social_links enable row level security;
create policy "public read social" on social_links for select using (true);
create policy "admin write social" on social_links for all using (is_admin()) with check (is_admin());

-- Giới hạn toàn cục: tối đa 10 tin nhắn mỗi 10 phút (security definer để đếm được dù khách không có quyền đọc)
create or replace function limit_messages() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from messages where created_at > now() - interval '10 minutes') >= 10 then
    raise exception 'Too many messages';
  end if;
  return new;
end $$;
drop trigger if exists messages_limit on messages;
create trigger messages_limit before insert on messages for each row execute function limit_messages();
