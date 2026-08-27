-- 0007: Media Assets
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  original_filename text not null,
  mime_type text not null,
  file_size int not null,
  storage_path text not null,
  public_url text,
  alt_text text,
  caption text,
  width int,
  height int,
  uploaded_by uuid references profiles(id) on delete set null,
  associated_tour_id uuid references tours(id) on delete set null,
  associated_journal_id uuid,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table media_assets enable row level security;
create policy "Public can view featured/public media" on media_assets for select using (is_featured = true or public_url is not null);
create policy "Staff can manage media" on media_assets for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_media_tour on media_assets(associated_tour_id) where associated_tour_id is not null;
create index if not exists idx_media_journal on media_assets(associated_journal_id) where associated_journal_id is not null;
create index if not exists idx_media_featured on media_assets(is_featured) where is_featured = true;