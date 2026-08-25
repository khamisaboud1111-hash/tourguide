// Lightweight analytics — pushes to window.dataLayer (GTM) / gtag if present.
// No PII. Events only. Wire a GTM/GA4 script in layout to activate.

type EventName =
  | "tour_view"
  | "tour_search"
  | "booking_started"
  | "booking_completed"
  | "whatsapp_clicked"
  | "payment_started"
  | "payment_completed"
  | "journal_article_view";

export function track(event: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
  w.gtag?.("event", event, params);
}
