"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { reportReview } from "@/app/actions/reviews";
import { useLang } from "@/lib/i18n/context";

export default function ReportReviewButton({ reviewId }: { reviewId: string }) {
  const { t } = useLang();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return <span className="text-xs text-lagoon-700">{t("reviewReported")}</span>;
  }

  return (
    <button
      type="button"
      disabled={isPending}
      title={t("reviewReportHint")}
      onClick={() =>
        startTransition(async () => {
          const res = await reportReview(reviewId);
          if (res.ok) setDone(true);
        })
      }
      className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-clove-600 transition-colors disabled:opacity-60"
    >
      <Flag size={12} /> {t("reviewReport")}
    </button>
  );
}
