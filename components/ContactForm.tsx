"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { business, waLink } from "@/lib/constants";
import type { Tour } from "@/lib/tours";
import { useLang } from "@/lib/i18n/context";

export default function ContactForm({ tours }: { tours: Tour[] }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [tour, setTour] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Hi ${business.guideName}, my name is ${name || "..."}.`,
      tour ? `I'm interested in: ${tour}.` : null,
      message ? message : null,
      contact ? `You can also reach me at: ${contact}` : null,
    ].filter(Boolean);
    window.open(waLink(lines.join(" ")), "_blank", "noopener,noreferrer");
  }

  const inputClasses =
    "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-clove-500 outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
          {t("yourName")}
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          placeholder="Jane Traveler"
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-stone-700 mb-1.5">
          {t("emailOrPhone")}
        </label>
        <input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputClasses}
          placeholder={t("emailPlaceholderPlain")}
        />
      </div>

      <div>
        <label htmlFor="tour" className="block text-sm font-medium text-stone-700 mb-1.5">
          {t("whichTour")}
        </label>
        <select
          id="tour"
          value={tour}
          onChange={(e) => setTour(e.target.value)}
          className={inputClasses}
        >
          <option value="">{t("notSureYet")}</option>
          {tours.map((tour) => (
            <option key={tour.slug} value={tour.title}>
              {tour.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
          {t("messageField")}
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClasses}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lagoon-600 text-stone-50 px-6 py-3.5 font-medium hover:bg-lagoon-700 transition-colors"
      >
        <Send size={16} />
        {t("sendViaWhatsapp")}
      </button>
      <p className="text-xs text-stone-500 text-center">
        {t("contactDisclaimer")}
      </p>
    </form>
  );
}
