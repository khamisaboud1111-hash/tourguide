-- 0003: Security hardening, roles, CRM, availability, payments, pricing integrity

-- ── 1. PROFILES + ROLES ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('admin','staff','customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile (not role)" on profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from profiles where id = auth.uid()));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Role helper (security definer so RLS policies can use it without recursion)
create or replace function public.is_staff_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','staff'));
$$;

-- Promote the FIRST admin manually (run once with the real admin user id):
-- update profiles set role='admin' where email='your-admin-email@example.com';

-- ── 2. RLS HARDENING ────────────────────────────────────────────────
-- Tours: write only for staff/admin (was: any authenticated user)
drop policy if exists "Admin can manage tours" on tours;
create policy "Staff can manage tours" on tours for all
  using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

-- Bookings: read/update only for staff/admin (was: any authenticated user)
drop policy if exists "Admin can view and manage bookings" on bookings;
drop policy if exists "Admin can update bookings" on bookings;
create policy "Staff can view bookings" on bookings for select using (public.is_staff_or_admin());
create policy "Staff can update bookings" on bookings for update using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
-- Public insert stays (customers request bookings anonymously)

-- ── 3. CUSTOMERS (CRM) ──────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  country text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email),
  check (email is not null or phone is not null)
);
alter table customers enable row level security;
create policy "Staff can manage customers" on customers for all
  using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_customers_email on customers(email);
create index if not exists idx_customers_phone on customers(phone);

-- ── 4. BOOKINGS: PRICING + PICKUP + WORKFLOW + CUSTOMER LINK ────────
alter table bookings
  add column if not exists customer_id uuid references customers(id) on delete set null,
  add column if not exists subtotal_usd numeric check (subtotal_usd >= 0),
  add column if not exists total_usd numeric check (total_usd >= 0),
  add column if not exists deposit_usd numeric check (deposit_usd >= 0),
  add column if not exists remaining_usd numeric check (remaining_usd >= 0),
  add column if not exists currency text not null default 'USD',
  add column if not exists pickup_location text,
  add column if not exists pickup_notes text,
  add column if not exists pickup_time text,
  add column if not exists country text;

-- Extended booking lifecycle
alter table bookings drop constraint if exists bookings_status_check;
alter table bookings add constraint bookings_status_check check (status in
  ('pending','contacted','confirmed','deposit_pending','deposit_paid','ready','completed','cancelled','refunded','rescheduled'));

create index if not exists idx_bookings_tour on bookings(tour_id);
create index if not exists idx_bookings_date on bookings(requested_date);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_customer on bookings(customer_id);

-- ── 5. TOUR AVAILABILITY ────────────────────────────────────────────
create table if not exists tour_availability (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  date date not null,
  capacity int not null default 8 check (capacity > 0),
  booked int not null default 0 check (booked >= 0),
  status text not null default 'available' check (status in ('available','limited','full','unavailable')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id, date)
);
alter table tour_availability enable row level security;
create policy "Public can view availability" on tour_availability for select using (true);
create policy "Staff can manage availability" on tour_availability for all
  using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_availability_tour_date on tour_availability(tour_id, date);

-- ── 6. PAYMENTS (idempotency + audit) ───────────────────────────────
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  tx_ref text not null unique,
  flutterwave_transaction_id text,
  amount_usd numeric not null check (amount_usd > 0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','successful','failed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table payments enable row level security;
create policy "Staff can view payments" on payments for select using (public.is_staff_or_admin());
create policy "Staff can insert payments" on payments for insert with check (public.is_staff_or_admin());
create policy "Staff can update payments" on payments for update using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_payments_booking on payments(booking_id);

-- ── 7. REVIEWS (moderated) ──────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete cascade,
  customer_name text not null,
  country text,
  rating int not null check (rating between 1 and 5),
  review text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table reviews enable row level security;
create policy "Public can view published reviews" on reviews for select using (published = true);
create policy "Staff can manage reviews" on reviews for all
  using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_reviews_tour on reviews(tour_id) where published = true;
