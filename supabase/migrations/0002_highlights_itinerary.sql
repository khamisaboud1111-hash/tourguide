-- Highlights, itinerary, what-to-bring, cancellation as editable CMS fields
alter table tours add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table tours add column if not exists itinerary text[] not null default '{}';
alter table tours add column if not exists what_to_bring text[] not null default '{}';
alter table tours add column if not exists cancellation_policy text not null default 'Free to cancel or reschedule until the guide confirms. After confirmation, message directly for weather or timing changes.';
alter table tours add column if not exists is_featured boolean not null default false;

-- Backfill existing 6 tours with sensible defaults from previous hardcoded fallbacks
update tours set highlights = '[{"title":"Walk the coral-stone alleys","body":"Carved doors, bazaars, layered history"},{"title":"House of Wonders & Slave Market memorial","body":"Context and quiet — where the island past is remembered properly."},{"title":"Rooftop viewpoint","body":"Stone Town flat roofs and sea beyond — best light before noon."}]'::jsonb where slug = 'stone-town-walking-tour';
update tours set itinerary = array['09:00 Meet at Forodhani Gardens','09:20 Coral-stone alleys & doors','10:00 Bazaar & House of Wonders','10:45 Memorial & viewpoints','12:00 Tea break, tour ends'] where slug = 'stone-town-walking-tour';

update tours set highlights = '[{"title":"Taste the Spice Island","body":"Clove, vanilla, cinnamon, nutmeg — live on the farm."},{"title":"Walk with the farmer","body":"How each crop is grown and why Zanzibar led world clove."},{"title":"Fruit tasting","body":"Fresh harvest to finish — seasonal."}]'::jsonb where slug = 'spice-farm-tour';
update tours set itinerary = array['09:00 Meet at spice farm gate','09:20 Walk + tasting — spices you can smell and taste','11:00 Fruit tasting','12:00 Return — same meeting point'] where slug = 'spice-farm-tour';

update tours set highlights = '[{"title":"Dhow sailing in Menai Bay","body":"Traditional dhow, calm water, sandbanks at low tide."},{"title":"Snorkeling the reef","body":"Clear protected water — gear included."},{"title":"Seafood lunch on beach","body":"Grilled fish, fruit — feet in sand."}]'::jsonb where slug = 'safari-blue';
update tours set itinerary = array['08:30 Fumba jetty & dhow boarding','09:30 Sail to sandbank, swim','11:00 Snorkel reef','13:00 Seafood lunch on beach','15:30 Sail back'] where slug = 'safari-blue';

update tours set highlights = '[{"title":"Red colobus monkeys","body":"Endemic to Zanzibar — quiet troops, close but wild."},{"title":"Mangrove boardwalk","body":"Suspended walk over estuary — birds, crabs, quiet."},{"title":"National park forest","body":"Zanzibar only national park — short easy walk."}]'::jsonb where slug = 'jozani-forest-tour';
update tours set itinerary = array['09:00 Jozani visitor centre','09:20 Forest walk — colobus troops','10:30 Mangrove boardwalk','11:15 Depart or optional extension'] where slug = 'jozani-forest-tour';

update tours set highlights = '[{"title":"Sunset from the water","body":"Stone Town skyline turns gold and pink as sun sets."},{"title":"Dhow sailing","body":"Traditional wooden dhow, relaxed evening sail."},{"title":"Evening breeze","body":"Snacks, soft drinks, quiet."}]'::jsonb where slug = 'sunset-dhow-cruise';
update tours set what_to_bring = array['Light layer for evening breeze','Camera','Sunscreen (if boarding before sunset)'] where slug = 'sunset-dhow-cruise';

update tours set highlights = '[{"title":"Giant tortoises","body":"Aldabra sanctuary — some over 100 years old."},{"title":"Prison Island history","body":"Former quarantine, now nature."},{"title":"Snorkel stop","body":"Clear water on return leg."}]'::jsonb where slug = 'prison-island-tour';

-- Featured example
update tours set is_featured = true where slug = 'safari-blue';

create index if not exists idx_tours_featured on tours(is_featured) where is_featured = true;
