-- 0012: Staff Permissions & Advanced Roles
create table if not exists staff_permissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  permission text not null, -- 'bookings.read', 'bookings.write', 'customers.read', 'customers.write', 'tours.read', 'tours.write', 'availability.read', 'availability.write', 'payments.read', 'payments.write', 'analytics.read', 'reviews.read', 'reviews.write', 'journal.read', 'journal.write', 'media.read', 'media.write', 'website.read', 'website.write', 'promotions.read', 'promotions.write', 'settings.read', 'settings.write', 'staff.read', 'staff.write', 'audit.read'
  granted_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (profile_id, permission)
);
alter table staff_permissions enable row level security;
create policy "Admin can manage staff permissions" on staff_permissions for all using (public.is_staff_or_admin() and (select role from profiles where id = auth.uid()) = 'admin') with check ((select role from profiles where id = auth.uid()) = 'admin');
create policy "Staff can view own permissions" on staff_permissions for select using (profile_id = auth.uid());
create index if not exists idx_staff_permissions_profile on staff_permissions(profile_id);

-- Permission sets for quick assignment
create table if not exists permission_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  permissions text[] not null,
  created_at timestamptz not null default now()
);
alter table permission_sets enable row level security;
create policy "Admin can manage permission sets" on permission_sets for all using ((select role from profiles where id = auth.uid()) = 'admin') with check ((select role from profiles where id = auth.uid()) = 'admin');
create policy "Staff can view permission sets" on permission_sets for select using (public.is_staff_or_admin());

-- Seed default permission sets
insert into permission_sets (name, description, permissions) values
  ('Admin', 'Full access to everything', array[
    'bookings.read','bookings.write','customers.read','customers.write',
    'tours.read','tours.write','availability.read','availability.write',
    'payments.read','payments.write','analytics.read',
    'reviews.read','reviews.write','journal.read','journal.write',
    'media.read','media.write','website.read','website.write',
    'promotions.read','promotions.write','settings.read','settings.write',
    'staff.read','staff.write','audit.read'
  ]),
  ('Manager', 'Manage bookings, customers, tours, availability', array[
    'bookings.read','bookings.write','customers.read','customers.write',
    'tours.read','tours.write','availability.read','availability.write',
    'payments.read','analytics.read','reviews.read','reviews.write',
    'journal.read','journal.write','media.read','media.write'
  ]),
  ('Booking Agent', 'Handle bookings and customer communication', array[
    'bookings.read','bookings.write','customers.read','customers.write',
    'availability.read','payments.read','reviews.read'
  ]),
  ('Content Editor', 'Manage tours, journal, media, website content', array[
    'tours.read','tours.write','journal.read','journal.write',
    'media.read','media.write','website.read','website.write',
    'reviews.read','reviews.write'
  ]),
  ('Analyst', 'View analytics and reports only', array[
    'analytics.read','bookings.read','customers.read','payments.read',
    'reviews.read'
  ])
on conflict (name) do nothing;

-- Function to assign permission set to staff
create or replace function public.assign_permission_set(p_profile_id uuid, p_set_name text, p_granted_by uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_permissions text[];
  v_perm text;
begin
  select permissions into v_permissions from permission_sets where name = p_set_name;
  if v_permissions is null then
    raise exception 'Permission set not found: %', p_set_name;
  end if;
  foreach v_perm in array v_permissions loop
    insert into staff_permissions (profile_id, permission, granted_by)
    values (p_profile_id, v_perm, p_granted_by)
    on conflict (profile_id, permission) do update set granted_by = p_granted_by;
  end loop;
end;
$$;

-- Check if user has specific permission
create or replace function public.has_permission(p_permission text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff_permissions where profile_id = auth.uid() and permission = p_permission
  ) or exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;