-- Run this once in your Supabase project's SQL Editor (Database → SQL Editor → New query).
-- Safe to run only once; re-running will error on "already exists", which is fine to ignore.

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  duration text not null,
  group_size text not null,
  difficulty text not null check (difficulty in ('Easy','Moderate','Active')),
  price_usd numeric not null check (price_usd >= 0),
  summary text not null,
  description text not null,
  includes text[] not null default '{}',
  excludes text[] not null default '{}',
  meeting_point text not null,
  lat double precision not null,
  lng double precision not null,
  photo_seed text not null default 'tour-placeholder',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete set null,
  tour_title_snapshot text not null,
  customer_name text not null,
  customer_contact text not null,
  requested_date date,
  party_size int check (party_size > 0),
  message text,
  status text not null default 'new' check (status in ('new','contacted','confirmed','completed','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','deposit_paid','paid_in_full')),
  payment_ref text,
  amount_usd numeric,
  created_at timestamptz not null default now()
);

alter table tours enable row level security;
alter table bookings enable row level security;

-- Anyone (including anonymous site visitors) can read published tours.
create policy if not exists "Public can view published tours"
  on tours for select
  using (is_published = true);

-- Only a logged-in admin (your friend) can create/edit/delete tours.
create policy if not exists "Admin can manage tours"
  on tours for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can submit a booking request (the public booking form).
create policy if not exists "Public can create bookings"
  on bookings for insert
  with check (true);

-- Only the logged-in admin can read or update booking requests —
-- customers cannot see each other's bookings.
create policy if not exists "Admin can view and manage bookings"
  on bookings for select
  using (auth.role() = 'authenticated');

create policy if not exists "Admin can update bookings"
  on bookings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed data so the admin panel isn't empty on first login.
-- Feel free to delete/edit these from the admin dashboard afterward.
insert into tours (slug, title, category, duration, group_size, difficulty, price_usd, summary, description, includes, excludes, meeting_point, lat, lng, photo_seed)
values
  ('stone-town-walking-tour', 'Stone Town Walking Tour', 'Culture & History', '3 hours', '1–8 people', 'Easy', 35,
   'Wind through Stone Town''s coral-stone alleys, past carved doors, old bazaars, and centuries of Swahili, Omani, and Indian history.',
   'This walk covers the House of Wonders, the old Slave Market memorial, the Darajani bazaar, and a rooftop viewpoint over the rooftops of the old town.',
   array['Licensed local guide','Bottled water','Entry fees where applicable'], array['Hotel pickup outside Stone Town','Lunch'],
   'Forodhani Gardens, Stone Town', -6.1636, 39.1901, 'stonetown-1'),
  ('spice-farm-tour', 'Spice Farm Tour', 'Culture & Nature', 'Half day', '1–10 people', 'Easy', 30,
   'Walk through a working spice farm and see, smell, and taste why Zanzibar was once the world''s largest clove exporter.',
   'Zanzibar earned the name Spice Island for a reason. Walk through farms growing cloves, vanilla, cinnamon, nutmeg, and cardamom.',
   array['Licensed local guide','Farm entry','Fruit tasting'], array['Hotel pickup outside central Zanzibar','Lunch'],
   'Kizimbani village (pickup can be arranged)', -6.1273, 39.2544, 'spicefarm-1'),
  ('safari-blue', 'Safari Blue Sailing Tour', 'Ocean & Sailing', 'Full day', '2–12 people', 'Moderate', 70,
   'A full day sailing a traditional dhow to sandbanks and reefs off the south coast, with snorkeling and a seafood lunch on the beach.',
   'Sail out on a traditional wooden dhow to the sandbanks and lagoons near Menai Bay, one of Zanzibar''s most protected marine areas.',
   array['Dhow sailing','Snorkeling gear','Seafood lunch','Fruit'], array['Hotel pickup (can be arranged for a small fee)'],
   'Fumba jetty, south Zanzibar', -6.3167, 39.35, 'safariblue-1'),
  ('jozani-forest-tour', 'Jozani Forest & Red Colobus Monkeys', 'Nature & Wildlife', 'Half day', '1–8 people', 'Easy', 40,
   'Walk Zanzibar''s only national park to see the endangered red colobus monkey, found nowhere else on Earth, plus a mangrove boardwalk.',
   'Jozani Chwaka Bay National Park is home to the Zanzibar red colobus monkey. A short forest walk gets you close to troops of monkeys in the wild.',
   array['Licensed local guide','Park entry fee','Mangrove boardwalk'], array['Hotel pickup outside central/south Zanzibar'],
   'Jozani Forest visitor center', -6.2664, 39.3903, 'jozani-1'),
  ('sunset-dhow-cruise', 'Sunset Dhow Cruise', 'Ocean & Sailing', '2 hours', '2–14 people', 'Easy', 45,
   'An evening sail along the Stone Town coastline on a traditional dhow, timed to be on the water as the sun goes down.',
   'A relaxed evening sail just offshore from Stone Town, with the old town skyline turning gold and pink as the sun sets.',
   array['Dhow sailing','Snacks','Soft drinks'], array['Hotel pickup','Alcoholic drinks'],
   'Mtoni Marine jetty, Stone Town', -6.1517, 39.1867, 'sunset-dhow-1'),
  ('prison-island-tour', 'Prison Island (Changuu) Tour', 'Ocean & Wildlife', 'Half day', '1–10 people', 'Easy', 35,
   'A short boat ride to Changuu Island to see its giant Aldabra tortoises, some over 100 years old, plus a snorkel stop.',
   'Changuu Island, better known as Prison Island, is now home to a sanctuary of giant Aldabra tortoises, some more than a century old.',
   array['Boat transfer','Island & tortoise sanctuary entry','Snorkeling gear'], array['Hotel pickup outside Stone Town','Lunch'],
   'Stone Town jetty (near Forodhani Gardens)', -6.1461, 39.1739, 'prisonisland-1')
on conflict (slug) do nothing;
