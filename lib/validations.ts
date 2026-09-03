import { z } from "zod";

export const tourSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  groupSize: z.string().min(1, "Group size is required"),
  difficulty: z.enum(["Easy", "Moderate", "Active"]),
  priceUsd: z.coerce.number().min(0, "Price can't be negative"),
  summary: z.string().min(10, "Summary is required"),
  description: z.string().min(20, "Description is required"),
  includes: z.string(), // newline-separated in the form, split before saving
  excludes: z.string(),
  meetingPoint: z.string().min(2, "Meeting point is required"),
  lat: z.coerce.number().min(-90).max(90).optional().or(z.literal("")),
  lng: z.coerce.number().min(-180).max(180).optional().or(z.literal("")),
  photoSeed: z.string().min(1, "Photo seed is required").optional().or(z.literal("")),
  isPublished: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  highlights: z.string().optional(), // JSON array or "Title: Body" lines
  itinerary: z.string().optional(), // newline per step
  whatToBring: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

// Zanzibar pickup areas — extendable list (single source of truth for form + validation)
export const PICKUP_LOCATIONS = [
  "Stone Town",
  "Nungwi",
  "Kendwa",
  "Paje",
  "Jambiani",
  "Kizimkazi",
  "Other",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export const bookingSchema = z
  .object({
    tourId: z.string().uuid("Invalid tour"),
    tourTitleSnapshot: z.string().min(1),
    customerName: z.string().min(2, "Name is required").max(100),
    customerContact: z
      .string()
      .max(200)
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || EMAIL_RE.test(v), "Enter a valid email"),
    whatsapp: z
      .string()
      .min(7, "WhatsApp number is required")
      .max(30)
      .refine((v) => PHONE_RE.test(v), "Enter a valid WhatsApp number"),
    requestedDate: z
      .string().min(1, "Date is required")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date")
      .refine((v) => {
        const d = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      }, "Date cannot be in the past"),
    partySize: z.coerce.number().int("Travelers must be a whole number").min(1, "At least 1 traveler").max(20, "Max 20 travelers — contact us for groups"),
    pickupLocation: z.enum(PICKUP_LOCATIONS).optional().or(z.literal("")),
    pickupNotes: z.string().max(500).optional().or(z.literal("")),
    country: z.string().max(80).optional().or(z.literal("")),
    message: z.string().max(1000).optional().or(z.literal("")),
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const reviewSchema = z.object({
  tourId: z.string().uuid().optional().or(z.literal("")),
  customerName: z.string().min(2).max(100),
  email: z.string().email("Enter a valid email").max(200).optional().or(z.literal("")),
  country: z.string().max(80).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().min(10).max(2000),
});
