"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions/reviews";

type Props = {
  tourId?: string;
  tourTitle?: string;
};

export default function ReviewForm({ tourId, tourTitle }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    if (tourId) fd.set("tourId", tourId);
    setMsg(null);
    startTransition(async () => {
      const res = await submitReview(fd);
      if (res.ok) {
        setMsg({ ok: true, text: "Thanks! Your review is awaiting moderation and will appear shortly." });
        (e.target as HTMLFormElement).reset();
        setRating(5);
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
      <h3 className="font-display text-lg font-semibold">Leave a review {tourTitle ? `for ${tourTitle}` : ""}</h3>
      <p className="text-sm text-stone-600">Rate 5 stars, share your experience, and show your profile.</p>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Your rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              aria-label={`Rate ${n} stars`}
              className="p-1"
            >
              <Star size={28} className={`${(hover || rating) >= n ? "fill-saffron-500 text-saffron-500" : "text-stone-300"} transition-colors`} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">Your name *</span>
          <input name="customerName" required placeholder="Jane Traveler" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">Email *</span>
          <input name="email" type="email" required placeholder="jane@example.com" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        </label>
      </div>
      <label className="space-y-1.5">
        <span className="block text-xs font-medium text-stone-700">Where are you from? (country)</span>
        <input name="country" placeholder="e.g. Germany, Kenya, UK" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
      </label>
      <label className="space-y-1.5">
        <span className="block text-xs font-medium text-stone-700">Your review *</span>
        <textarea name="review" required rows={4} placeholder="What did you love? The guide, the food, the boat..." className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
      </label>

      <button type="submit" disabled={isPending} className="w-full rounded-full bg-clove-600 text-white px-6 py-3 font-medium hover:bg-clove-700 disabled:opacity-60">
        {isPending ? "Submitting…" : "Submit review"}
      </button>
      {msg && (
        <p className={`text-sm px-3 py-2 rounded-lg ${msg.ok ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>
          {msg.text}
        </p>
      )}
      <p className="text-xs text-stone-500">Your profile (name, email, country, rating) will be shown with your review after approval. Email is displayed as contact, not for marketing.</p>
    </form>
  );
}
