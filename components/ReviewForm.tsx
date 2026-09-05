"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions/reviews";
import { useLang } from "@/lib/i18n/context";
import CountrySelect from "@/components/CountrySelect";

type Props = {
  tourId?: string;
  tourTitle?: string;
  tours?: { id: string; title: string }[];
};

export default function ReviewForm({ tourId, tourTitle, tours }: Props) {
  const { t } = useLang();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [country, setCountry] = useState("");
  const [selectedTour, setSelectedTour] = useState(tourId ?? "");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [burst, setBurst] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    fd.set("country", country);
    const effectiveTourId = tourId ?? selectedTour;
    if (effectiveTourId) {
      fd.set("tourId", effectiveTourId);
      const match = tours?.find((x) => x.id === effectiveTourId);
      if (match) fd.set("tourTitle", match.title);
    } else if (tourTitle) {
      fd.set("tourTitle", tourTitle);
    }
    setMsg(null);
    startTransition(async () => {
      const res = await submitReview(fd);
      if (res.ok) {
        setMsg({ ok: true, text: t("reviewThankYou") });
        (e.target as HTMLFormElement).reset();
        setRating(5);
        setCountry("");
        if (!tourId) setSelectedTour("");
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
      <h3 className="font-display text-lg font-semibold">{t("leaveReview")} {tourTitle ? `for ${tourTitle}` : ""}</h3>
      <p className="text-sm text-stone-600">{t("reviewProfileHint").split(".")[0]}.</p>

      <div className="relative">
        <label className="block text-sm font-medium text-stone-700 mb-1.5">{t("yourRating")} *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => {
                setRating(n);
                setBurst(true);
                setBurstKey((k) => k + 1);
                setTimeout(() => setBurst(false), 800);
              }}
              aria-label={`Rate ${n} stars`}
              className="p-1 relative"
            >
              <Star size={28} className={`${(hover || rating) >= n ? "fill-saffron-500 text-saffron-500" : "text-stone-300"} transition-colors`} />
            </button>
          ))}
        </div>
        {burst && (
          <div key={burstKey} className="pointer-events-none absolute left-0 top-8 flex gap-1 animate-burst">
            <span className="animate-float1 text-lg">❤️</span>
            <span className="animate-float2 text-sm">⭐</span>
            <span className="animate-float3 text-base">💖</span>
            <span className="animate-float1 text-sm">✨</span>
            <span className="animate-float2 text-lg">🌟</span>
            <span className="animate-float3 text-sm">💕</span>
            <span className="animate-float1 text-base">⭐</span>
          </div>
        )}
        <style jsx>{`
          @keyframes burstUp {
            0% { transform: translateY(0) scale(0.5); opacity: 1; }
            100% { transform: translateY(-32px) scale(1.2); opacity: 0; }
          }
          .animate-burst { animation: burstUp 0.8s ease-out forwards; }
          @keyframes float1 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-28px) rotate(15deg); } }
          @keyframes float2 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-36px) rotate(-10deg); } }
          @keyframes float3 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-24px) rotate(8deg); } }
          .animate-float1 { animation: float1 0.8s ease-out forwards; }
          .animate-float2 { animation: float2 0.9s ease-out forwards; }
          .animate-float3 { animation: float3 0.7s ease-out forwards; }
        `}</style>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">{t("yourName")} *</span>
          <input name="customerName" required placeholder="Jane Traveler" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">Email * <span className="font-normal text-stone-400">(private — never shown publicly)</span></span>
          <input name="email" type="email" required placeholder="jane@example.com" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        </label>
      </div>
      {!tourId && tours && tours.length > 0 && (
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">{t("reviewTourLabel")}</span>
          <select
            name="tourSelect"
            value={selectedTour}
            onChange={(e) => setSelectedTour(e.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500"
          >
            <option value="">{t("reviewSelectTour")}</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>{tour.title}</option>
            ))}
          </select>
        </label>
      )}
      <label className="space-y-1.5">
        <span className="block text-xs font-medium text-stone-700">{t("whereFrom")}</span>
        <CountrySelect value={country} onChange={setCountry} placeholder="Select your country" />
      </label>
      <label className="space-y-1.5">
        <span className="block text-xs font-medium text-stone-700">{t("yourReview")} *</span>
        <textarea name="review" required rows={4} placeholder="What did you love? The guide, the food, the boat..." className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
      </label>

      <button type="submit" disabled={isPending} className="w-full rounded-full bg-clove-600 text-white px-6 py-3 font-medium hover:bg-clove-700 disabled:opacity-60">
        {isPending ? t("submittingReview") : t("submitReview")}
      </button>
      {msg && (
        <p className={`text-sm px-3 py-2 rounded-lg ${msg.ok ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>
          {msg.text}
        </p>
      )}
      <p className="text-xs text-stone-500">{t("reviewProfileHint")}</p>
    </form>
  );
}
