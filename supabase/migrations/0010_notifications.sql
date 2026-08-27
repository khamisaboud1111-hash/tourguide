-- 0010: Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null, -- 'booking_new', 'payment_received', 'payment_failed', 'review_pending', 'tour_full', 'upcoming_tour', 'outstanding_balance', 'staff_activity'
  title text not null,
  message text not null,
  entity_type text, -- 'booking', 'payment', 'review', 'tour', 'customer'
  entity_id uuid,
  is_read boolean not null default false,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (user_id = auth.uid());
create policy "Staff can view all notifications" on notifications for select using (public.is_staff_or_admin());
create policy "System can insert notifications" on notifications for insert with check (true);
create index if not exists idx_notifications_user on notifications(user_id, is_read);
create index if not exists idx_notifications_created on notifications(created_at desc);
create index if not exists idx_notifications_entity on notifications(entity_type, entity_id);

-- Automated notification triggers
create or replace function public.notify_booking_new()
returns trigger security definer set search_path = public as $$
begin
  -- Notify all staff
  insert into notifications (user_id, type, title, message, entity_type, entity_id, priority)
  select id, 'booking_new', 'New booking request', 'New booking for ' || NEW.tour_title_snapshot, 'booking', NEW.id, 'high'
  from profiles where role in ('admin','staff');
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_notify_booking_new on bookings;
create trigger trigger_notify_booking_new after insert on bookings
for each row execute function public.notify_booking_new();

create or replace function public.notify_payment_received()
returns trigger security definer set search_path = public as $$
begin
  if NEW.status = 'successful' and OLD.status = 'pending' then
    insert into notifications (user_id, type, title, message, entity_type, entity_id, priority)
    select id, 'payment_received', 'Payment received', 'Payment of $' || NEW.amount_usd || ' received for booking ' || NEW.booking_id, 'payment', NEW.id, 'normal'
    from profiles where role in ('admin','staff');
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_notify_payment on payments;
create trigger trigger_notify_payment after update on payments
for each row execute function public.notify_payment_received();

create or replace function public.notify_review_pending()
returns trigger security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, title, message, entity_type, entity_id, priority)
  select id, 'review_pending', 'New review awaiting moderation', 'Review by ' || NEW.customer_name || ' for tour ' || (select title from tours where id = NEW.tour_id), 'review', NEW.id, 'normal'
  from profiles where role in ('admin','staff');
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trigger_notify_review on reviews;
create trigger trigger_notify_review after insert on reviews
for each row execute function public.notify_review_pending();