"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { authorizeStaff } from "@/lib/auth";

async function upsertWebsiteSetting(section: string, key: string, value: unknown, description?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("website_settings").upsert(
    {
      section,
      key,
      value,
      ...(description ? { description } : {}),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section,key" }
  );
  if (error) throw new Error(error.message);
}

async function upsertBusinessSetting(category: string, key: string, value: unknown, description?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("business_settings").upsert(
    {
      category,
      key,
      value,
      ...(description ? { description } : {}),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category,key" }
  );
  if (error) throw new Error(error.message);
}

export async function saveHomepageSettings(formData: FormData) {
  await authorizeStaff("update homepage settings");
  const heroTitle = String(formData.get("heroTitle") ?? "");
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "");
  const heroCta = String(formData.get("heroCta") ?? "");
  const heroImageSeed = String(formData.get("heroImageSeed") ?? "");
  const aboutTitle = String(formData.get("aboutTitle") ?? "");
  const aboutBody = String(formData.get("aboutBody") ?? "");

  await Promise.all([
    upsertWebsiteSetting("homepage", "hero_title", heroTitle),
    upsertWebsiteSetting("homepage", "hero_subtitle", heroSubtitle),
    upsertWebsiteSetting("homepage", "cta_text", heroCta),
    ...(heroImageSeed ? [upsertWebsiteSetting("homepage", "hero_image_seed", heroImageSeed)] : []),
    upsertWebsiteSetting("homepage", "about_title", aboutTitle),
    upsertWebsiteSetting("homepage", "about_body", aboutBody),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  return { ok: true };
}

export async function saveAboutSettings(formData: FormData) {
  await authorizeStaff("update about settings");
  const title = String(formData.get("title") ?? "");
  const intro = String(formData.get("intro") ?? "");
  const story = String(formData.get("story") ?? "");
  const mission = String(formData.get("mission") ?? "");
  const values = String(formData.get("values") ?? "");

  await Promise.all([
    upsertWebsiteSetting("about", "page_title", title),
    upsertWebsiteSetting("about", "intro", intro),
    upsertWebsiteSetting("about", "guide_story", story),
    upsertWebsiteSetting("about", "mission", mission),
    upsertWebsiteSetting("about", "values", values),
  ]);
  revalidatePath("/about");
  revalidatePath("/admin/website/about");
  return { ok: true };
}

export async function saveContactSettings(formData: FormData) {
  await authorizeStaff("update contact settings");
  const heading = String(formData.get("heading") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const address = String(formData.get("address") ?? "");
  const hours = String(formData.get("hours") ?? "");

  await Promise.all([
    upsertWebsiteSetting("contact", "heading", heading),
    upsertWebsiteSetting("contact", "email", email),
    upsertWebsiteSetting("contact", "phone", phone),
    upsertWebsiteSetting("contact", "address", address),
    upsertWebsiteSetting("contact", "hours", hours),
    // also sync business_settings for global use
    upsertBusinessSetting("business", "email", email),
    upsertBusinessSetting("business", "phone", phone),
    upsertBusinessSetting("business", "address", address),
  ]);
  revalidatePath("/contact");
  revalidatePath("/admin/website/contact");
  return { ok: true };
}

export async function saveFooterSettings(formData: FormData) {
  await authorizeStaff("update footer settings");
  const about = String(formData.get("about") ?? "");
  const facebook = String(formData.get("facebook") ?? "");
  const instagram = String(formData.get("instagram") ?? "");
  const whatsapp = String(formData.get("whatsapp") ?? "");
  const copyright = String(formData.get("copyright") ?? "");

  await Promise.all([
    upsertWebsiteSetting("footer", "description", about),
    upsertWebsiteSetting("footer", "copyright", copyright),
    upsertWebsiteSetting("social", "facebook", facebook),
    upsertWebsiteSetting("social", "instagram", instagram),
    upsertWebsiteSetting("social", "whatsapp", whatsapp),
    upsertBusinessSetting("social", "facebook", facebook),
    upsertBusinessSetting("social", "instagram", instagram),
    upsertBusinessSetting("social", "whatsapp", whatsapp),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/website/footer");
  return { ok: true };
}

export async function saveSocialSettings(formData: FormData) {
  await authorizeStaff("update social settings");
  const facebook = String(formData.get("facebook") ?? "");
  const instagram = String(formData.get("instagram") ?? "");
  const twitter = String(formData.get("twitter") ?? "");
  const youtube = String(formData.get("youtube") ?? "");
  const whatsapp = String(formData.get("whatsapp") ?? "");

  await Promise.all([
    upsertWebsiteSetting("social", "facebook", facebook),
    upsertWebsiteSetting("social", "instagram", instagram),
    upsertWebsiteSetting("social", "twitter", twitter),
    upsertWebsiteSetting("social", "youtube", youtube),
    upsertWebsiteSetting("social", "whatsapp", whatsapp),
    upsertBusinessSetting("social", "facebook", facebook),
    upsertBusinessSetting("social", "instagram", instagram),
    upsertBusinessSetting("social", "whatsapp", whatsapp),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/settings/social");
  return { ok: true };
}

export async function saveBusinessSettings(formData: FormData) {
  await authorizeStaff("update business settings");
  const name = String(formData.get("name") ?? "");
  const tagline = String(formData.get("tagline") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const address = String(formData.get("address") ?? "");

  await Promise.all([
    upsertBusinessSetting("business", "name", name),
    upsertBusinessSetting("business", "tagline", tagline),
    upsertBusinessSetting("business", "email", email),
    upsertBusinessSetting("business", "phone", phone),
    upsertBusinessSetting("business", "address", address),
    upsertWebsiteSetting("business", "name", name),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/settings/business");
  return { ok: true };
}

export async function saveBookingSettings(formData: FormData) {
  await authorizeStaff("update booking settings");
  const minPartySize = String(formData.get("minPartySize") ?? "1");
  const maxPartySize = String(formData.get("maxPartySize") ?? "20");
  const bookingWindowDays = String(formData.get("bookingWindowDays") ?? "90");
  await Promise.all([
    upsertBusinessSetting("booking", "min_party_size", Number(minPartySize)),
    upsertBusinessSetting("booking", "max_party_size", Number(maxPartySize)),
    upsertBusinessSetting("booking", "booking_window_days", Number(bookingWindowDays)),
  ]);
  revalidatePath("/admin/settings/booking");
  return { ok: true };
}

export async function saveSecuritySettings(formData: FormData) {
  await authorizeStaff("update security settings");
  const twoFactorAuth = String(formData.get("twoFactorAuth") ?? "false");
  const sessionTimeout = String(formData.get("sessionTimeout") ?? "30");
  const passwordMinLength = String(formData.get("passwordMinLength") ?? "8");
  const allowOtp = String(formData.get("allowOtp") ?? "true");
  await Promise.all([
    upsertBusinessSetting("security", "two_factor_auth", twoFactorAuth === "true"),
    upsertBusinessSetting("security", "session_timeout", Number(sessionTimeout)),
    upsertBusinessSetting("security", "password_min_length", Number(passwordMinLength)),
    upsertBusinessSetting("security", "allow_otp", allowOtp === "true"),
  ]);
  revalidatePath("/admin/settings/security");
  return { ok: true };
}

export async function savePricingSettings(formData: FormData) {
  await authorizeStaff("update pricing settings");
  const defaultPricing = String(formData.get("defaultPricing") ?? "per_person");
  const currency = String(formData.get("currency") ?? "USD");
  const vatPercent = String(formData.get("vatPercent") ?? "0");
  const seasonalEnabled = String(formData.get("seasonalEnabled") ?? "false");
  await Promise.all([
    upsertBusinessSetting("pricing", "default_model", defaultPricing),
    upsertBusinessSetting("currency", "default", currency),
    upsertBusinessSetting("pricing", "vat_percent", Number(vatPercent)),
    upsertBusinessSetting("pricing", "seasonal_enabled", seasonalEnabled === "true"),
  ]);
  revalidatePath("/admin/tours/pricing");
  return { ok: true };
}
