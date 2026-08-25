# IMPLEMENTATION PLAN — Production Upgrade (updated after Phase 1)

## Status
- Phase 0 Audit: DONE
- Phase 1 Security & Data Integrity: DONE (code + migration; run migration 0003 in Supabase SQL editor)
- Phase 2 Booking engine: PARTIAL (availability table + checks done; admin availability calendar pending)
- Phase 3 Admin/CRM: PARTIAL (summary cards + pricing columns + WhatsApp action done; customers page pending)
- Phase 4-7: pending

## Phase 1 — Security & Data Integrity (COMPLETE)

### Implemented
- lib/pricing.ts: authoritative calculateBookingPrice() — subtotal/deposit/remaining, min $1 deposit, cent rounding
- lib/auth.ts: getCurrentProfile / isStaffOrAdmin / authorizeStaff (throws)
- supabase/migrations/0003_security_crm_availability.sql:
  - profiles table (role: admin/staff/customer) + signup trigger + is_staff_or_admin() security-definer helper
  - RLS: tours + bookings write policies now require staff/admin (was: any authenticated)
  - customers CRM table (unique email, email-or-phone check)
  - tour_availability (capacity/booked/status, unique tour+date, public read, staff write)
  - payments table (unique tx_ref, status, flutterwave id) — idempotency anchor
  - reviews table (rating 1-5 check, published flag, public read approved only)
  - bookings: +customer_id, subtotal/total/deposit/remaining_usd, currency, pickup_location/notes, country; extended status lifecycle constraint; indexes
- bookings action: rate limit, Zod validation (date not past, contact email-or-phone, party 1-20, pickup enum), tour published check, availability overbooking check, server-side pricing, customer upsert, computed totals stored
- payments action: staff-guarded OR booking-UUID capability, amount ALWAYS server-calculated from booking (deposit vs remaining), unique tx_ref, payments row before redirect
- webhook: timing-safe signature, idempotency via payments.status, server-to-server verify, amount validation (±$1 FX tolerance), booking status advance (deposit->balance, pending->confirmed)
- tours actions: all guarded by authorizeStaff
- email: booking ref + pickup in templates
- admin bookings: summary cards (pending/confirmed/deposits/outstanding), ZKT refs, pricing grid, payment badge, WhatsApp-customer deep link, new status options
- BookingForm + BookOnlineForm: pickup location select (PICKUP_LOCATIONS), multiplied pricing preview via calculateBookingPrice, min-date, travelers validation
- tests: pricing.test (9), validations.test (10), placeholder.test (4) — 23 passing
- .env.example added

### REQUIRED MANUAL STEP
Run supabase/migrations/0003_security_crm_availability.sql in Supabase SQL Editor, then:
  update profiles set role='admin' where email='<admin-email>';
(First login creates the profile row automatically via trigger.)

### Remaining for Phase 2/3
- Admin availability calendar UI (block dates, set capacity)
- Customers CRM page
- Reviews moderation UI
- booking/confirmed page: use payments table for verification
