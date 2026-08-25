-- 0004: Journal CMS — posts managed from /admin/journal

create table if not exists journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_seed text not null default 'journal-default',
  category text not null default 'Guides',
  reading_minutes int not null default 4 check (reading_minutes between 1 and 60),
  author text not null default 'Abdul Hamid',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table journal_posts enable row level security;

create policy "Public can view published posts" on journal_posts for select using (published = true);
create policy "Staff can manage posts" on journal_posts for all
  using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

create index if not exists idx_journal_published on journal_posts(published, published_at desc);

-- Seed the existing 3 drafts so nothing is lost
insert into journal_posts (slug, title, excerpt, cover_seed, category, reading_minutes, author, published) values
  ('best-time-to-visit-zanzibar', 'Best time to visit Zanzibar', 'Seasons, tides, and when each tour shines — a quick planner for your dates.', 'journal-season', 'Planning', 4, 'Abdul Hamid', false),
  ('what-to-pack-spice-farm', 'What to pack for a spice farm', 'Shoes, sun, and the small things a guide notices.', 'journal-pack', 'Tips', 3, 'Abdul Hamid', false),
  ('stone-town-half-day', 'Stone Town in half a day', 'A slow walk — doors, bazaars, markets and rooftops without rushing.', 'journal-stonetown', 'Guides', 5, 'Abdul Hamid', false)
on conflict (slug) do nothing;
