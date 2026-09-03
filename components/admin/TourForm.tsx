"use client";

import { useState } from "react";
import type { Tour } from "@/lib/tours";
import { useLang } from "@/lib/i18n/context";

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
  is_featured?: boolean;
  highlights?: { title: string; body: string }[];
  itinerary?: string[];
  what_to_bring?: string[];
  cancellation_policy?: string;
};

type Props = {
  action: (formData: FormData) => void;
  tour?: TourRow;
};

const inputClasses =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500";
const labelClasses = "block text-sm font-medium text-stone-700 mb-1.5";

export default function TourForm({ action, tour }: Props) {
  const { t } = useLang();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="space-y-6 max-w-2xl"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="title">{t("tourFormTitle")}</label>
          <input id="title" name="title" required defaultValue={tour?.title} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="slug">
            {t("tourFormSlug")} <span className="text-stone-400 font-normal">({t("tourFormSlugHint")})</span>
          </label>
          <input id="slug" name="slug" required defaultValue={tour?.slug} className={inputClasses} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="category">{t("tourFormCategory")}</label>
          <input id="category" name="category" required defaultValue={tour?.category} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="duration">{t("tourFormDuration")}</label>
          <input id="duration" name="duration" required defaultValue={tour?.duration} placeholder={t("tourFormDurationPlaceholder")} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="groupSize">{t("tourFormGroupSize")} <span className="text-stone-400 font-normal">({t("tourFormOptional")})</span></label>
          <input id="groupSize" name="groupSize" defaultValue={tour?.group_size} placeholder={t("tourFormGroupSizePlaceholder")} className={inputClasses} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="difficulty">{t("tourFormDifficulty")}</label>
          <select id="difficulty" name="difficulty" defaultValue={tour?.difficulty ?? "Easy"} className={inputClasses}>
            <option value="Easy">{t("tourFormDifficultyEasy")}</option>
            <option value="Moderate">{t("tourFormDifficultyModerate")}</option>
            <option value="Active">{t("tourFormDifficultyActive")}</option>
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="priceUsd">{t("tourFormPrice")}</label>
          <input id="priceUsd" name="priceUsd" type="number" min="0" step="1" required defaultValue={tour?.price_usd} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="photoSeed">
            {t("tourFormPhoto")} <span className="text-stone-400 font-normal">({t("tourFormPhotoHint")})</span>
          </label>
          <input id="photoSeed" name="photoSeed" defaultValue={tour?.photo_seed} placeholder={t("tourFormPhotoPlaceholder")} className={inputClasses} />
          <p className="mt-1 text-xs text-stone-500">
            {t("tourFormPhotoHelp")}
          </p>
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="summary">{t("tourFormSummary")}</label>
        <textarea id="summary" name="summary" required rows={2} defaultValue={tour?.summary} className={inputClasses} />
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">{t("tourFormDescription")}</label>
        <textarea id="description" name="description" required rows={4} defaultValue={tour?.description} className={inputClasses} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="includes">
            {t("tourFormIncluded")} <span className="text-stone-400 font-normal">({t("tourFormOnePerLine")})</span>
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
            {t("tourFormExcluded")} <span className="text-stone-400 font-normal">({t("tourFormOnePerLine")})</span>
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
        <label className={labelClasses} htmlFor="meetingPoint">{t("tourFormMeetingPoint")}</label>
        <input id="meetingPoint" name="meetingPoint" required defaultValue={tour?.meeting_point} className={inputClasses} />
        <p className="text-xs text-stone-500 mt-1">{t("tourFormMeetingPointHint")}</p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="tourPhotos">{t("tourFormPhotos")} <span className="text-stone-400 font-normal">({t("tourFormPhotosHint")})</span></label>
        <input id="tourPhotos" name="tourPhotos" type="file" accept="image/*" multiple className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-clove-600 file:text-white file:px-4 file:py-1 file:text-sm" />
        <p className="mt-1 text-xs text-stone-500">{t("tourFormPhotosHelp")}</p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="highlights">{t("tourFormHighlights")} <span className="text-stone-400 font-normal">({t("tourFormHighlightsHint")})</span></label>
        <textarea id="highlights" name="highlights" rows={3} defaultValue={tour?.highlights ? tour.highlights.map((h) => `${h.title}: ${h.body}`).join("\n") : ""} placeholder={t("tourFormHighlightsPlaceholder")} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses} htmlFor="itinerary">{t("tourFormItinerary")} <span className="text-stone-400 font-normal">({t("tourFormOnePerLine")})</span></label>
        <textarea id="itinerary" name="itinerary" rows={4} defaultValue={tour?.itinerary?.join("\n") ?? ""} placeholder={t("tourFormItineraryPlaceholder")} className={inputClasses} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="whatToBring">{t("tourFormWhatToBring")} <span className="text-stone-400 font-normal">({t("tourFormOnePerLine")})</span></label>
          <textarea id="whatToBring" name="whatToBring" rows={3} defaultValue={tour?.what_to_bring?.join("\n") ?? ""} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="cancellationPolicy">{t("tourFormCancellation")}</label>
          <textarea id="cancellationPolicy" name="cancellationPolicy" rows={3} defaultValue={tour?.cancellation_policy ?? ""} className={inputClasses} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="isPublished" defaultChecked={tour?.is_published ?? true} className="rounded border-stone-300" />
        {t("tourFormPublished")}
      </label>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="isFeatured" defaultChecked={tour?.is_featured ?? false} className="rounded border-stone-300" />
        {t("tourFormFeatured")}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-clove-600 hover:bg-clove-700 disabled:opacity-60 transition-colors text-stone-50 px-6 py-3 font-medium"
      >
        {submitting ? t("tourFormSaving") : t("tourFormSave")}
      </button>
    </form>
  );
}
