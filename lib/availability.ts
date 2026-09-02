"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AvailabilityRow = {
  id: string;
  tour_id: string;
  date: string;
  capacity: number;
  booked: number;
  status: "available" | "limited" | "full" | "unavailable";
  notes: string | null;
};

export async function listAvailability(tourId: string, fromISO: string, toISO: string): Promise<AvailabilityRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tour_availability")
    .select("*")
    .eq("tour_id", tourId)
    .gte("date", fromISO)
    .lte("date", toISO)
    .order("date");
  return (data as AvailabilityRow[]) ?? [];
}

export type UpsertAvailabilityInput = {
  tourId: string;
  date: string;
  capacity?: number;
  status: "available" | "limited" | "full" | "unavailable";
  notes?: string;
};

export async function upsertAvailability(input: UpsertAvailabilityInput) {
  const { tourId, date, capacity, status, notes } = input;
  const supabase = await createClient();
  const { error } = await supabase.from("tour_availability").upsert(
    {
      tour_id: tourId,
      date,
      ...(capacity !== undefined ? { capacity } : {}),
      status,
      ...(notes !== undefined ? { notes } : {}),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "tour_id,date" }
  );
  if (error) throw new Error(`Couldn't update availability: ${error.message}`);
  revalidatePath("/admin/availability");
}

// Server action wrapper for the admin form
export async function setAvailabilityAction(formData: FormData) {
  const tourId = String(formData.get("tourId") ?? "");
  const date = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "available") as "available" | "limited" | "full" | "unavailable";
  const capacityRaw = formData.get("capacity");
  await upsertAvailability({
    tourId,
    date,
    status,
    ...(capacityRaw ? { capacity: parseInt(String(capacityRaw)) } : {}),
  });
}
