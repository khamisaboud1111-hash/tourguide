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
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  photoSeed: z.string().min(1, "Photo seed is required"),
  isPublished: z.coerce.boolean().optional(),
});

export const bookingSchema = z.object({
  tourId: z.string().uuid().optional().or(z.literal("")),
  tourTitleSnapshot: z.string().min(1),
  customerName: z.string().min(2, "Name is required"),
  customerContact: z.string().min(3, "Email or phone is required"),
  requestedDate: z.string().optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1).optional(),
  message: z.string().optional(),
});
