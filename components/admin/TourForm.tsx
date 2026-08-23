"use client";

import { useState } from "react";
import type { Tour } from "@/lib/tours";

type TourRow = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  group_size: string;
  difficulty: Tour["difficulty"];
  price_usd: number;
  summary: string;
  description: string;
  includes: string[];
  excludes: string[];
  meeting_point: string;
  lat: number;
  lng: number;
  photo_seed: string;
  is_published: boolean;
};

type Props = {
  action: (formData: FormData) => void;
  tour?: TourRow;
};

const inputClasses =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500";
const labelClasses = "block text-sm font-medium text-stone-700 mb-1.5";

export default function TourForm({ action, tour }: Props) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="space-y-6 max-w-2xl"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="title">Title</label>
          <input id="title" name="title" required defaultValue={tour?.title} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="slug">
            URL slug <span className="text-stone-400 font-normal">(lowercase-with-hyphens)</span>
          </label>
          <input id="slug" name="slug" required defaultValue={tour?.slug} className={inputClasses} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="category">Category</label>
          <input id="category" name="category" required defaultValue={tour?.category} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="duration">Duration</label>
          <input id="duration" name="duration" required defaultValue={tour?.duration} placeholder="e.g. Half day" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="groupSize">Group size</label>
          <input id="groupSize" name="groupSize" required defaultValue={tour?.group_size} placeholder="e.g. 1–8 people" className={inputClasses} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" defaultValue={tour?.difficulty ?? "Easy"} className={inputClasses}>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="priceUsd">Price (USD)</label>
          <input id="priceUsd" name="priceUsd" type="number" min="0" step="1" required defaultValue={tour?.price_usd} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="photoSeed">
            Photo <span className="text-stone-400 font-normal">(see hint below)</span>
          </label>
          <input id="photoSeed" name="photoSeed" required defaultValue={tour?.photo_seed} className={inputClasses} />
          <p className="mt-1 text-xs text-stone-500">
            Leave as a short word for a placeholder photo, or use{" "}
            <code>photos/filename.jpg</code> to show a real photo you&apos;ve
            uploaded to the site&apos;s <code>public/photos</code> folder.
          </p>
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="summary">Summary (shown on tour cards)</label>
        <textarea id="summary" name="summary" required rows={2} defaultValue={tour?.summary} className={inputClasses} />
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">Full description</label>
        <textarea id="description" name="description" required rows={4} defaultValue={tour?.description} className={inputClasses} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="includes">
            Included <span className="text-stone-400 font-normal">(one per line)</span>
          </label>
          <textarea
            id="includes"
            name="includes"
            rows={4}
            defaultValue={tour?.includes.join("\n")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="excludes">
            Not included <span className="text-stone-400 font-normal">(one per line)</span>
          </label>
          <textarea
            id="excludes"
            name="excludes"
            rows={4}
            defaultValue={tour?.excludes.join("\n")}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="meetingPoint">Meeting point</label>
        <input id="meetingPoint" name="meetingPoint" required defaultValue={tour?.meeting_point} className={inputClasses} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="lat">Latitude</label>
          <input id="lat" name="lat" type="number" step="any" required defaultValue={tour?.lat} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="lng">Longitude</label>
          <input id="lng" name="lng" type="number" step="any" required defaultValue={tour?.lng} className={inputClasses} />
        </div>
      </div>
      <p className="text-xs text-stone-500 -mt-3">
        Tip: right-click the spot on Google Maps and tap the coordinates to copy them.
      </p>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={tour?.is_published ?? true}
          className="rounded border-stone-300"
        />
        Published (visible on the live site)
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-clove-600 hover:bg-clove-700 disabled:opacity-60 transition-colors text-stone-50 px-6 py-3 font-medium"
      >
        {submitting ? "Saving…" : "Save tour"}
      </button>
    </form>
  );
}
