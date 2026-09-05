"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInResult = { ok: boolean; error?: string };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export async function changePassword(formData: FormData): Promise<ChangePasswordResult> {
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 12) {
    return { ok: false, error: "New password must be at least 12 characters." };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return { ok: false, error: "Password must include uppercase, lowercase, and a number." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to change your password." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
