"use server";

import { createClient } from "@/lib/supabase/server";
import { authorizeStaff } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCalendarEvent(formData: FormData) {
  await authorizeStaff("create calendar event");
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!title || !date) throw new Error("Title and date are required");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("calendar_events").insert({
    title,
    date,
    notes: notes || null,
    created_by: user?.id ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings/calendar");
}

export async function deleteCalendarEvent(id: string) {
  await authorizeStaff("delete calendar event");
  const supabase = await createClient();
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings/calendar");
}
