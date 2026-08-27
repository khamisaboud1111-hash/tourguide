-- 0011: Audit Logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  actor_role text,
  action text not null, -- e.g., 'booking.created', 'booking.status_changed', 'tour.updated', 'payment.created', 'review.moderated', 'customer.updated', 'staff.added', 'settings.changed'
  entity_type text not null, -- 'booking', 'tour', 'payment', 'review', 'customer', 'promotion', 'settings', 'staff'
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  metadata jsonb default '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
create policy "Staff can view audit logs" on audit_logs for select using (public.is_staff_or_admin());
create policy "System can insert audit logs" on audit_logs for insert with check (true);
create index if not exists idx_audit_logs_actor on audit_logs(actor_id, created_at desc);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id, created_at desc);
create index if not exists idx_audit_logs_action on audit_logs(action, created_at desc);
create index if not exists idx_audit_logs_created on audit_logs(created_at desc);

-- Helper function for audit logging
create or replace function public.log_audit(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_old_value jsonb default null,
  p_new_value jsonb default null,
  p_metadata jsonb default '{}'
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_actor_id uuid;
  v_actor_role text;
  v_ip inet;
  v_ua text;
begin
  -- Try to get current user
  begin
    select id, role into v_actor_id, v_actor_role from profiles where id = auth.uid();
  exception when others then
    v_actor_id := null;
    v_actor_role := 'system';
  end;

  -- Try to get request info (if available via headers)
  v_ip := null;
  v_ua := null;

  insert into audit_logs (actor_id, actor_role, action, entity_type, entity_id, old_value, new_value, metadata, ip_address, user_agent)
  values (v_actor_id, v_actor_role, p_action, p_entity_type, p_entity_id, p_old_value, p_new_value, p_metadata, v_ip, v_ua);
end;
$$;

-- Trigger functions for common audit events
create or replace function public.audit_booking_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('booking.created', 'booking', NEW.id, null, to_jsonb(NEW), jsonb_build_object('tour_id', NEW.tour_id, 'customer_name', NEW.customer_name));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('booking.updated', 'booking', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('booking.deleted', 'booking', OLD.id, to_jsonb(OLD), null, jsonb_build_object('tour_id', OLD.tour_id));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_booking on bookings;
create trigger trigger_audit_booking after insert or update or delete on bookings
for each row execute function public.audit_booking_change();

create or replace function public.audit_tour_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('tour.created', 'tour', NEW.id, null, to_jsonb(NEW), jsonb_build_object('title', NEW.title));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('tour.updated', 'tour', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('tour.deleted', 'tour', OLD.id, to_jsonb(OLD), null, jsonb_build_object('title', OLD.title));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_tour on tours;
create trigger trigger_audit_tour after insert or update or delete on tours
for each row execute function public.audit_tour_change();

create or replace function public.audit_payment_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('payment.created', 'payment', NEW.id, null, to_jsonb(NEW), jsonb_build_object('booking_id', NEW.booking_id));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('payment.updated', 'payment', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_payment on payments;
create trigger trigger_audit_payment after insert or update on payments
for each row execute function public.audit_payment_change();

create or replace function public.audit_customer_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('customer.created', 'customer', NEW.id, null, to_jsonb(NEW), jsonb_build_object('name', NEW.full_name));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('customer.updated', 'customer', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('customer.deleted', 'customer', OLD.id, to_jsonb(OLD), null, jsonb_build_object('name', OLD.full_name));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_customer on customers;
create trigger trigger_audit_customer after insert or update or delete on customers
for each row execute function public.audit_customer_change();

create or replace function public.audit_review_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('review.created', 'review', NEW.id, null, to_jsonb(NEW), jsonb_build_object('tour_id', NEW.tour_id));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('review.updated', 'review', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('review.deleted', 'review', OLD.id, to_jsonb(OLD), null, jsonb_build_object('tour_id', OLD.tour_id));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_review on reviews;
create trigger trigger_audit_review after insert or update or delete on reviews
for each row execute function public.audit_review_change();

create or replace function public.audit_promotion_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('promotion.created', 'promotion', NEW.id, null, to_jsonb(NEW), jsonb_build_object('code', NEW.code));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('promotion.updated', 'promotion', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('promotion.deleted', 'promotion', OLD.id, to_jsonb(OLD), null, jsonb_build_object('code', OLD.code));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_promotion on promotions;
create trigger trigger_audit_promotion after insert or update or delete on promotions
for each row execute function public.audit_promotion_change();

create or replace function public.audit_staff_change()
returns trigger security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.log_audit('staff.added', 'staff', NEW.id, null, to_jsonb(NEW), jsonb_build_object('email', NEW.email, 'role', NEW.role));
  elsif TG_OP = 'UPDATE' then
    perform public.log_audit('staff.updated', 'staff', NEW.id, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('changed_fields', (select jsonb_object_agg(key, value) from (select * from jsonb_each(to_jsonb(NEW)) intersect select * from jsonb_each(to_jsonb(OLD)) where NEW.* is distinct from OLD.*) t)));
  elsif TG_OP = 'DELETE' then
    perform public.log_audit('staff.removed', 'staff', OLD.id, to_jsonb(OLD), null, jsonb_build_object('email', OLD.email));
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_audit_staff on profiles;
create trigger trigger_audit_staff after insert or update or delete on profiles
for each row
when (OLD.role is distinct from NEW.role or OLD.* is distinct from NEW.*)
execute function public.audit_staff_change();