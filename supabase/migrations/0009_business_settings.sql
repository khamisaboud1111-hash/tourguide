-- 0009: Business Settings
create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  category text not null, -- 'business', 'booking', 'currency', 'social'
  key text not null,
  value jsonb not null default '{}',
  description text,
  is_secret boolean not null default false, -- for API keys, etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, key)
);
alter table business_settings enable row level security;
create policy "Staff can manage business settings" on business_settings for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create index if not exists idx_business_settings_category on business_settings(category);

-- Seed default business settings
insert into business_settings (category, key, value, description, is_secret) values
  ('business', 'name', '"Sitmeir Tours and Travel"', 'Business name', false),
  ('business', 'tagline', '"See Zanzibar the way locals do"', 'Business tagline', false),
  ('business', 'description', '"Authentic Zanzibar tours with a licensed local guide."', 'Business description', false),
  ('business', 'email', '"abdulhamidameir96@gmail.com"', 'Business email', false),
  ('business', 'phone', '"0674804477"', 'Display phone number', false),
  ('business', 'whatsapp', '"255674804477"', 'WhatsApp number with country code', false),
  ('business', 'address', '"Stone Town, Zanzibar, Tanzania"', 'Business address', false),
  ('business', 'logo_url', '""', 'Logo image URL', false),
  ('booking', 'deposit_percent', '0.2', 'Deposit percentage (0.2 = 20%)', false),
  ('booking', 'min_notice_hours', '24', 'Minimum booking notice in hours', false),
  ('booking', 'max_party_size', '20', 'Maximum party size per booking', false),
  ('booking', 'cancellation_policy', '"Free to cancel or reschedule until the guide confirms. After confirmation, message directly for weather or timing changes."', 'Default cancellation policy', false),
  ('currency', 'default', '"USD"', 'Default currency', false),
  ('currency', 'supported', '["USD", "TZS", "EUR", "GBP"]', 'Supported currencies', false),
  ('social', 'instagram', '"https://instagram.com/sitmeirtourtravel"', 'Instagram URL', false),
  ('social', 'tiktok', '"https://tiktok.com/@sitmeirtourtravel"', 'TikTok URL', false),
  ('social', 'facebook', '"https://facebook.com/Abdul Hamid"', 'Facebook URL', false),
  ('social', 'whatsapp', '"https://wa.me/255674804477"', 'WhatsApp URL', false)
on conflict (category, key) do nothing;