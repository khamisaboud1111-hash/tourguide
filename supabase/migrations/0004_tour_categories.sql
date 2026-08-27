-- 0004: Tour Categories
create table if not exists tour_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table tour_categories enable row level security;
create policy "Public can view active categories" on tour_categories for select using (is_active = true);
create policy "Staff can manage categories" on tour_categories for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_tour_categories_slug on tour_categories(slug) where is_active = true;

-- Add category_id to tours
alter table tours add column if not exists category_id uuid references tour_categories(id) on delete set null;
create index if not exists idx_tours_category_id on tours(category_id) where category_id is not null;

-- Seed default categories matching existing tours
insert into tour_categories (name, slug, description, display_order, is_active) values
  ('Culture & History', 'culture-history', 'Historical tours of Stone Town and cultural experiences', 1, true),
  ('Ocean & Sailing', 'ocean-sailing', 'Dhow cruises, sailing tours, and marine adventures', 2, true),
  ('Nature & Wildlife', 'nature-wildlife', 'Forest walks, national parks, and wildlife encounters', 3, true),
  ('Culture & Nature', 'culture-nature', 'Spice farms and combined cultural/natural experiences', 4, true),
  ('Ocean & Wildlife', 'ocean-wildlife', 'Island tours with wildlife and marine life', 5, true)
on conflict (slug) do nothing;

-- Backfill existing tours
update tours set category_id = (select id from tour_categories where slug = 'culture-history') where category = 'Culture & History' and category_id is null;
update tours set category_id = (select id from tour_categories where slug = 'ocean-sailing') where category = 'Ocean & Sailing' and category_id is null;
update tours set category_id = (select id from tour_categories where slug = 'nature-wildlife') where category = 'Nature & Wildlife' and category_id is null;
update tours set category_id = (select id from tour_categories where slug = 'culture-nature') where category = 'Culture & Nature' and category_id is null;
update tours set category_id = (select id from tour_categories where slug = 'ocean-wildlife') where category = 'Ocean & Wildlife' and category_id is null;