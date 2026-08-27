"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 rounded bg-stone-100 animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-6 rounded bg-stone-100 animate-pulse" />
            ))}
          </div>
          <div className="h-6 rounded bg-stone-100 animate-pulse w-3/4" />
          <div className="h-6 rounded bg-stone-100 animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  );
}