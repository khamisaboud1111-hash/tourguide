-- 0008: Website Settings / CMS
create table if not exists website_settings (
  id uuid primary key default gen_random_uuid(),
  section text not null, -- 'homepage', 'about', 'contact', 'footer', 'seo', 'social'
  key text not null,
  value jsonb not null default '{}',
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, key)
);
alter table website_settings enable row level security;
create policy "Public can view public settings" on website_settings for select using (is_public = true);
create policy "Staff can manage settings" on website_settings for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_website_settings_section on website_settings(section);

-- Seed default website settings
insert into website_settings (section, key, value, description, is_public) values
  ('homepage', 'hero_title', '"See Zanzibar the way locals do"', 'Hero section title', true),
  ('homepage', 'hero_subtitle', '"Your Guide\\'s Name — A licensed Zanzibar tour guide with years of experience"', 'Hero section subtitle', true),
  ('homepage', 'hero_image_seed', '"hero-zanzibar"', 'Hero background image seed', true),
  ('homepage', 'cta_text', '"Book a Tour"', 'Hero CTA button text', true),
  ('homepage', 'cta_link', '"/book"', 'Hero CTA link', true),
  ('homepage', 'about_title', '"Meet Your Guide"', 'About section title', true),
  ('homepage', 'about_subtitle', '"A local\\'s perspective on the island"', 'About section subtitle', true),
  ('homepage', 'about_bio', '"A licensed Zanzibar tour guide with years of experience showing visitors the real island — its old town, its spice farms, and its reefs."', 'Guide bio for about section', true),
  ('homepage', 'about_image_seed', '"guide-portrait"', 'Guide portrait image seed', true),
  ('homepage', 'stats_tours', '"6"', 'Number of tours for homepage stats', true),
  ('homepage', 'stats_years', '"5+"', 'Years of experience for homepage stats', true),
  ('homepage', 'stats_customers', '"500+"', 'Happy customers for homepage stats', true),
  ('homepage', 'stats_rating', '"4.9"', 'Average rating for homepage stats', true),
  ('about', 'guide_name', '"Your Guide\\'s Name"', 'Guide full name', true),
  ('about', 'guide_bio', '"A licensed Zanzibar tour guide with years of experience showing visitors the real island — its old town, its spice farms, and its reefs."', 'Guide biography', true),
  ('about', 'guide_experience', '"5+ years"', 'Guide experience', true),
  ('about', 'guide_languages', '"English, Swahili"', 'Languages spoken', true),
  ('about', 'guide_certifications', '"Licensed Zanzibar Tour Guide, First Aid Certified"', 'Certifications', true),
  ('about', 'guide_story', '"Born and raised in Stone Town, I grew up walking these alleys, learning the stories behind every carved door and coral-stone wall. After years guiding visitors from around the world, I still find new corners to love. My tours aren\\'t about checking boxes — they\\'re about slowing down, noticing the details, and feeling the rhythm of Zanzibar."', 'Guide personal story', true),
  ('about', 'guide_image_seed', '"guide-portrait"', 'Guide portrait image', true),
  ('contact', 'phone', '"0674804477"', 'Display phone number', true),
  ('contact', 'whatsapp', '"255674804477"', 'WhatsApp number with country code', true),
  ('contact', 'email', '"abdulhamidameir96@gmail.com"', 'Contact email', true),
  ('contact', 'address', '"Stone Town, Zanzibar, Tanzania"', 'Business address', true),
  ('contact', 'hours', '"Mon-Sun: 8:00 AM - 8:00 PM"', 'Business hours', true),
  ('footer', 'description', '"See Zanzibar the way locals do — authentic tours with a licensed local guide."', 'Footer description', true),
  ('footer', 'copyright', '"© 2025 Sitmeir Tours and Travel. All rights reserved."', 'Copyright text', true),
  ('footer', 'links', '{"Useful": [{"label": "Book a Tour", "href": "/book"}, {"label": "Our Tours", "href": "/tours"}, {"label": "Gallery", "href": "/gallery"}, {"label": "Journal", "href": "/journal"}], "Connect": [{"label": "WhatsApp", "href": "https://wa.me/255674804477"}, {"label": "Instagram", "href": "https://instagram.com/sitmeirtourtravel"}, {"label": "TikTok", "href": "https://tiktok.com/@sitmeirtourtravel"}, {"label": "Facebook", "href": "https://facebook.com/Abdul Hamid"}]}', 'Footer link groups', true),
  ('seo', 'site_title', '"Sitmeir Tours and Travel — See Zanzibar the way locals do"', 'Default site title', true),
  ('seo', 'meta_description', '"Authentic Zanzibar tours with a licensed local guide. Stone Town walks, spice farms, sailing, wildlife, and sunset cruises."', 'Default meta description', true),
  ('seo', 'og_image_seed', '"hero-zanzibar"', 'Default OG image seed', true),
  ('seo', 'robots', '"index, follow"', 'Robots meta tag', true),
  ('social', 'instagram', '"https://instagram.com/sitmeirtourtravel"', 'Instagram URL', true),
  ('social', 'tiktok', '"https://tiktok.com/@sitmeirtourtravel"', 'TikTok URL', true),
  ('social', 'facebook', '"https://facebook.com/Abdul Hamid"', 'Facebook URL', true),
  ('social', 'whatsapp', '"https://wa.me/255674804477"', 'WhatsApp URL', true)
on conflict (section, key) do nothing;