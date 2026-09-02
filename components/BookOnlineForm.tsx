"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Calendar, Users, User, Mail, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { createBooking } from "@/app/actions/bookings";
import { business } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { AnimatePresence, motion } from "motion/react";
import { PICKUP_LOCATIONS } from "@/lib/validations";
import { calculateBookingPrice } from "@/lib/pricing";
import { useLang } from "@/lib/i18n/context";

type TourOption = { id: string; slug: string; title: string; priceUsd: number; duration: string; groupSize: string };

const inputBase =
  "w-full rounded-xl border bg-stone-50 px-4 py-3 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 transition-colors";

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};

export default function BookOnlineForm({ tours }: { tours: TourOption[] }) {
  const { t } = useLang();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string; bookingId?: string } | null>(null);

  const [tourId, setTourId] = useState(tours[0]?.id ?? "");
  const [requestedDate, setRequestedDate] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [pickupLocation, setPickupLocation] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const selected = tours.find((t) => t.id === tourId);
  const travelers = Math.max(1, parseInt(partySize) || 1);
  // price hidden until admin sets via TourForm
  const preview: ReturnType<typeof calculateBookingPrice> | null = null;
  const ref = result?.bookingId ? `ZKT-${result.bookingId.slice(0, 8).toUpperCase()}` : "";

  const canStep1 = tourId && partySize && parseInt(partySize) >= 1;
  const canStep2 = customerName.trim().length >= 2 && customerContact.trim().length >= 3;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("tourId", tourId);
    formData.set("tourTitleSnapshot", selected?.title ?? "");
    formData.set("customerName", customerName);
    formData.set("customerContact", customerContact);
    formData.set("whatsapp", whatsapp);
    formData.set("requestedDate", requestedDate);
    formData.set("partySize", String(travelers));
    formData.set("pickupLocation", pickupLocation);
    formData.set("message", message);
    startTransition(async () => {
      const res = await createBooking(formData);
      setResult(res.ok ? { ok: true, bookingId: res.bookingId } : { ok: false, error: res.error });
      if (res.ok) track("booking_completed", { tour: selected?.title ?? "" });
    });
  }

  if (result?.ok) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lagoon-600 text-white shrink-0">
            <CheckCircle2 size={22} />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-lagoon-900">{t("bookingRequestReceived")}</p>
            <p className="text-sm text-lagoon-800 mt-1">
              {t("reference")} <span className="font-mono font-semibold">{ref}</span>
            </p>
          </div>
        </div>

        <ol className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-sm text-stone-700 list-decimal list-inside space-y-1.5">
          <li>Your request has been received.</li>
          <li>The guide will confirm availability for your date.</li>
          <li>You&apos;ll get the exact meeting point with the confirmation.</li>
        </ol>

        {selected && (
          <div className="rounded-xl bg-white border border-stone-200 p-4 text-sm">
            <div className="flex justify-between"><span className="text-stone-600">{t("tourField")}</span><span className="font-medium">{selected.title}</span></div>
            {requestedDate && <div className="flex justify-between"><span className="text-stone-600">{t("dateField")}</span><span>{requestedDate}</span></div>}
            <div className="flex justify-between"><span className="text-stone-600">{t("travelersField")}</span><span>{partySize}</span></div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <a href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Hi ${business.guideName}, I have a question about my booking ${ref}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-lagoon-700 hover:text-lagoon-800 font-medium">
            <MessageCircle size={15} /> {t("whatsappAbout")} {ref}
          </a>
          <span className="text-stone-300">·</span>
          <a href="/tours" className="text-clove-700 hover:text-clove-800 font-medium">{t("backToTours")}</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: t("tourAndDate") },
          { n: 2, label: t("yourDetails") },
          { n: 3, label: t("reviewStepAria") },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-xs font-semibold border shrink-0 ${step >= s.n ? "bg-clove-600 text-white border-clove-600" : "bg-stone-100 text-stone-500 border-stone-200"}`}>{s.n}</span>
            <span className={`hidden sm:block text-xs ${step === s.n ? "text-clove-700 font-semibold" : "text-stone-500"}`}>{s.label}</span>
            {s.n !== 3 && <span className={`flex-1 h-px ${step > s.n ? "bg-clove-300" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
      {step === 1 && (
        <motion.div key="s1" {...stepMotion} className="space-y-4">
          <div>
            <label htmlFor="tour" className="block text-sm font-medium text-stone-700 mb-1.5">{t("chooseYourExperience")}</label>
            <select id="tour" value={tourId} onChange={(e) => setTourId(e.target.value)} className={inputBase}>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>{tour.title} — {tour.duration}</option>
              ))}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><Calendar size={14} className="text-clove-600" /> {t("preferredDate")}</label>
              <input id="date" type="date" required min={new Date().toISOString().slice(0, 10)} value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} className={inputBase} />
              <p className="text-xs text-stone-500 mt-1">{t("flexiblePickAnyDate")}</p>
            </div>
            <div>
              <label htmlFor="party" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><Users size={14} className="text-clove-600" /> {t("travelers")}</label>
              <input id="party" type="number" min={1} max={20} value={partySize} onChange={(e) => setPartySize(e.target.value)} className={inputBase} />
              {selected && <p className="text-xs text-stone-500 mt-1">{t("groupSize")} {selected.groupSize}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-stone-700 mb-1.5">{t("pickupArea")}</label>
            <select id="pickup" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputBase}>
              <option value="">{t("notSureYet")}</option>
              {PICKUP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <button type="button" disabled={!canStep1} onClick={() => setStep(2)} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3.5 font-medium hover:bg-clove-700 disabled:opacity-50 transition-colors shadow-soft">
            {t("continue")} <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
      {step === 2 && (
        <motion.div key="s2" {...stepMotion} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><User size={14} className="text-clove-600" /> {t("yourName")}</label>
            <input id="name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Traveler" className={inputBase} />
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><Mail size={14} className="text-clove-600" /> {t("emailOrPhone")}</label>
            <input id="contact" required value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder="jane@example.com or +255…" className={inputBase} />
          </div>
          <div>
            <label htmlFor="whatsapp2" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><MessageCircle size={14} className="text-clove-600" /> WhatsApp <span className="text-stone-400 font-normal">(optional)</span></label>
            <input id="whatsapp2" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+255 700 000 000" className={inputBase} />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-stone-700 mb-1.5">{t("notesOptional")}</label>
            <textarea id="notes" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hotel name, pickup needs, special requests…" className={inputBase} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
              <ArrowLeft size={15} /> {t("backBtn")}
            </button>
            <button type="button" disabled={!canStep2} onClick={() => setStep(3)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3.5 font-medium hover:bg-clove-700 disabled:opacity-50 transition-colors shadow-soft">
              {t("reviewBooking")} <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
      {step === 3 && (
        <motion.div key="s3" {...stepMotion} className="space-y-4">
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><span className="text-stone-500">{t("tourField")}</span><span className="font-medium text-stone-900 text-right">{selected?.title}</span></div>
            {requestedDate && <div className="flex justify-between"><span className="text-stone-500">{t("dateField")}</span><span>{requestedDate}</span></div>}
            <div className="flex justify-between"><span className="text-stone-500">{t("travelersField")}</span><span>{partySize}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">{t("nameField")}</span><span>{customerName}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">{t("contactField")}</span><span className="truncate max-w-[180px]">{customerContact}</span></div>
            {message && <div><span className="text-stone-500">{t("notesField")}</span><p className="mt-1 text-stone-700 bg-white rounded-lg border border-stone-200 p-2">{message}</p></div>}
          </div>

          {result && !result.ok && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{result.error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
              <ArrowLeft size={15} /> {t("backBtn")}
            </button>
            <button type="submit" disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3.5 font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
              {isPending ? t("sendingRequest") : t("sendBookingRequest")} <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-stone-500 text-center">{t("noChargeNow")}</p>
        </motion.div>
      )}
      </AnimatePresence>
    </form>
  );
}
