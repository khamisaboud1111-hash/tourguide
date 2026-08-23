import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This uses the SERVICE ROLE key, which bypasses Row Level Security.
// Only use this in trusted, server-only code that never runs in the
// browser and never forwards unverified user input directly into a
// write — e.g. the Flutterwave webhook, after its signature check.
// Everywhere else (pages, admin forms), use lib/supabase/server.ts
// instead, which respects RLS via the signed-in user's session.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
