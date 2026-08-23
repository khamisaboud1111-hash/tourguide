"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { business, waLink } from "@/lib/constants";

export default function WhatsAppButton() {
  const pathname = usePathname();
  // Contextual label + message
  let label = "Chat with your guide";
  let text = `Hi ${business.guideName}, I'd like to ask about a tour.`;
  let shortLabel = "WhatsApp";

  if (pathname?.startsWith("/tours/") && pathname !== "/tours") {
    label = "Ask about this tour";
    shortLabel = "Ask";
    // slug appears in pathname — use it in message for context
    const slug = pathname.split("/").pop() || "";
    const pretty = slug.replace(/-/g, " ");
    text = `Hi ${business.guideName}, I'm interested in the ${pretty} tour. Is it available?`;
  } else if (pathname?.startsWith("/booking")) {
    label = "Need help? WhatsApp us";
    shortLabel = "Help";
    text = `Hi ${business.guideName}, I have a question about my booking.`;
  }

  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-lagoon-700 text-white pl-4 pr-5 py-3.5 shadow-floating hover:bg-lagoon-800 transition-colors focus-ring"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <MessageCircle size={16} />
      </span>
      <span className="text-sm font-medium hidden sm:inline">{label}</span>
      <span className="text-sm font-medium sm:hidden">{shortLabel}</span>
    </a>
  );
}
