-- 0005: Pricing Seasons (Seasonal Pricing)
create table if not exists pricing_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  start_date date not null,
  end_date date not null,
  price_adjustment_percent numeric not null default 0 check (price_adjustment_percent >= -100),
  affected_tour_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_date <= end_date)
);
alter table pricing_seasons enable row level security;
create policy "Public can view active pricing seasons" on pricing_seasons for select using (is_active = true);
create policy "Staff can manage pricing seasons" on pricing_seasons for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_pricing_seasons_dates on pricing_seasons(start_date, end_date) where is_active = true;
create index if not exists idx_pricing_seasons_tours on pricing_seasons using gin(affected_tour_ids);

-- Seed default seasons
insert into pricing_seasons (name, slug, start_date, end_date, price_adjustment_percent, affected_tour_ids, is_active) values
  ('High Season', 'high-season', '2026-06-01', '2026-10-31', 15, '{}', true),
  ('Low Season', 'low-season', '2026-11-01', '2026-05-31', -10, '{}', true)
on conflict (slug) do nothing;