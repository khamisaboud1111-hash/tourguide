-- 0006: Promotions & Coupons
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric not null check (discount_value > 0),
  min_booking_amount numeric,
  max_uses int,
  uses_count int not null default 0,
  per_customer_limit int not null default 1,
  applicable_tour_ids uuid[] not null default '{}',
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at <= expires_at)
);
alter table promotions enable row level security;
create policy "Public can view active promotions" on promotions for select using (is_active = true and starts_at <= now() and expires_at >= now());
create policy "Staff can manage promotions" on promotions for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_promotions_code on promotions(code) where is_active = true;
create index if not exists idx_promotions_dates on promotions(starts_at, expires_at) where is_active = true;

-- Promotion usage tracking
create table if not exists promotion_usage (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references promotions(id) on delete cascade,
  booking_id uuid not null references bookings(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  discount_applied numeric not null check (discount_applied >= 0),
  created_at timestamptz not null default now()
);
alter table promotion_usage enable row level security;
create policy "Staff can view promotion usage" on promotion_usage for select using (public.is_staff_or_admin());
create policy "Staff can insert promotion usage" on promotion_usage for insert with check (public.is_staff_or_admin());
create unique index if not exists idx_promotion_usage_booking on promotion_usage(booking_id);
create index if not exists idx_promotion_usage_promotion on promotion_usage(promotion_id);
create index if not exists idx_promotion_usage_customer on promotion_usage(customer_id);