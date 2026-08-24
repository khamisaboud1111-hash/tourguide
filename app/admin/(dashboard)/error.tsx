"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-clove-200 bg-clove-50 p-6 max-w-xl">
      <h2 className="font-display text-lg font-semibold text-clove-800 mb-2">
        Something didn&apos;t save
      </h2>
      <p className="text-sm text-clove-700 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-full bg-clove-600 hover:bg-clove-700 transition-colors text-stone-50 px-5 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
