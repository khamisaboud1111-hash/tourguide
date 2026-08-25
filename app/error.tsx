"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook a monitoring service (Sentry etc.) here later
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Something went wrong</h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          An unexpected error occurred. Please try again — or reach us on WhatsApp and we&apos;ll help directly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 transition-colors shadow-soft"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 transition-colors"
          >
            Back to home
          </a>
        </div>
        {error.digest && <p className="mt-6 text-xs text-stone-400">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}
