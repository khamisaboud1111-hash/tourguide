import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "staff" | "customer";
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("id, email, full_name, role").eq("id", user.id).single();
  return (data as Profile) ?? null;
}

export async function isStaffOrAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin" || profile?.role === "staff";
}

// Server-action guard — throws on unauthorized. Use in every privileged action.
export async function authorizeStaff(action: string): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "staff")) {
    throw new Error(`Unauthorized: ${action} requires staff or admin role.`);
  }
  return profile;
}
