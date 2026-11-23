-- Chạy trong Supabase > SQL Editor: thêm các cột nội dung tiếng Anh (bỏ trống thì trang EN dùng bản tiếng Việt).
alter table profile add column if not exists headline_en text;
alter table profile add column if not exists bio_en text;
alter table entries add column if not exists title_en text;
alter table entries add column if not exists summary_en text;
alter table entries add column if not exists body_en text;
