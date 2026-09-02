"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Calendar, Users, User, Mail, MessageCircle, MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createBooking } from "@/app/actions/bookings";
import { business } from "@/lib/constants";
import { PICKUP_LOCATIONS } from "@/lib/validations";
import { calculateBookingPrice } from "@/lib/pricing";
import { useLang } from "@/lib/i18n/context";
import CountrySelect from "@/components/CountrySelect";

type Props = {
  tourId?: string;
  tourTitle: string;
  priceUsd?: number;
};

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};

export default function BookingForm({ tourId, tourTitle, priceUsd }: Props) {
  const reduce = useReducedMotion();
  const { t } = useLang();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string; bookingId?: string; reference?: string } | null>(null);

  const [requestedDate, setRequestedDate] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  const travelers = Math.max(1, parseInt(partySize) || 1);

  function canContinueStep2() {
    return customerName.trim().length >= 2 && whatsapp.trim().length >= 7;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("tourId", tourId ?? "");
    formData.set("tourTitleSnapshot", tourTitle);
    formData.set("customerName", customerName);
    formData.set("customerContact", customerContact);
    formData.set("whatsapp", whatsapp);
    formData.set("country", country);
    formData.set("requestedDate", requestedDate);
    formData.set("partySize", String(travelers));
    formData.set("pickupLocation", pickupLocation);
    formData.set("pickupNotes", pickupNotes);
    formData.set("message", message);

    startTransition(async () => {
      const res = await createBooking(formData);
      if (res.ok) {
        setResult({ ok: true, bookingId: res.bookingId, reference: res.reference });
        import("@/lib/analytics").then(({ track }) => track("booking_completed", { tour: tourTitle }));
      } else setResult({ ok: false, error: res.error });
    });
  }

  const inputBase = "w-full rounded-xl border bg-stone-50 px-4 py-3 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 transition-colors";
  const err = result && !result.ok ? result.error : null;
  const anim = reduce ? {} : stepMotion;

  if (result?.ok) {
    const ref = result.reference ?? "";
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-lagoon-200 bg-lagoon-50 p-5 space-y-4">
        <div className="flex gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shrink-0">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="font-display font-semibold text-lagoon-900">Booking request sent — pending confirmation</p>
            <p className="text-sm text-lagoon-800 mt-1">
              {t("reference")} <span className="font-mono font-semibold">{ref}</span> — Admin will answer via your WhatsApp/email whether accepted or not. Save this reference to check status.
            </p>
            <p className="text-xs text-stone-600 mt-2">Status: <span className="font-medium text-amber-700">Pending</span> — you’ll be notified on WhatsApp/email when admin confirms.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <a href={`/booking/status?ref=${encodeURIComponent(ref)}`} className="inline-flex items-center gap-1 text-lagoon-700 hover:text-lagoon-800 font-medium">
            Check booking status
          </a>
          <span className="text-stone-300">·</span>
          <a href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Hi ${business.guideName}, I have a question about my booking ${ref}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lagoon-700 hover:text-lagoon-800">
            <MessageCircle size={14} /> {t("whatsapp")}
          </a>
          <span className="text-stone-300">·</span>
          <a href="/tours" className="text-lagoon-700 hover:text-lagoon-800">{t("backToTours")}</a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span className={`h-7 w-7 rounded-full inline-flex items-center justify-center text-xs font-medium border transition-colors ${step >= s ? "bg-clove-600 text-white border-clove-600" : "bg-stone-100 text-stone-500 border-stone-200"}`}>
              {s}
            </span>
            <span className={`hidden sm:block text-xs ${step === s ? "text-clove-700 font-medium" : "text-stone-500"}`}>
              {s === 1 ? t("dateField") : s === 2 ? t("details") : t("reviewStepAria")}
            </span>
            {s !== 3 && <span className={`flex-1 h-px ${step > s ? "bg-clove-300" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 && (
          <motion.div key="s1" {...anim} className="space-y-3">
            <div>
              <label htmlFor="requestedDate" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-clove-600" /> {t("whenWouldYouLikeToGo")}
              </label>
              <input id="requestedDate" type="date" required value={requestedDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setRequestedDate(e.target.value)} className={inputBase} />
            </div>
            <div>
              <label htmlFor="partySize" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Users size={14} className="text-clove-600" /> {t("travelers")}
              </label>
              <input id="partySize" type="number" min={1} max={20} required value={partySize} onChange={(e) => setPartySize(e.target.value)} className={inputBase} />
            </div>
            <div>
              <label htmlFor="pickup" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-clove-600" /> {t("pickupArea")}
              </label>
              <select id="pickup" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputBase}>
                <option value="">{t("notSureYet")}</option>
                {PICKUP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              {pickupLocation === "Other" && (
                <input value={pickupNotes} onChange={(e) => setPickupNotes(e.target.value)} placeholder="Hotel / area name…" className={`${inputBase} mt-2`} />
              )}
            </div>

            <button type="button" onClick={() => setStep(2)} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 font-medium hover:bg-stone-800 transition-colors">
              {t("continue")} <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" {...anim} className="space-y-3">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><User size={14} className="text-clove-600" /> {t("yourName")}</label>
              <input id="customerName" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Traveler" className={inputBase} />
            </div>
            <div>
              <label htmlFor="customerContact" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><Mail size={14} className="text-clove-600" /> Email <span className="text-stone-400 font-normal">(optional)</span></label>
              <input id="customerContact" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder="jane@example.com" className={inputBase} />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><MessageCircle size={14} className="text-clove-600" /> WhatsApp number <span className="text-clove-600">*</span></label>
              <input id="whatsapp" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+255 700 000 000" className={inputBase} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Country <span className="text-stone-400 font-normal">(search alphabetically)</span></label>
              <CountrySelect value={country} onChange={setCountry} placeholder="Select your country" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">{t("notesOptional")}</label>
              <textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hotel name, special requests, questions…" className={inputBase} />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
                <ArrowLeft size={14} /> {t("backBtn")}
              </button>
              <button type="button" disabled={!canContinueStep2()} onClick={() => setStep(3)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 font-medium hover:bg-stone-800 transition-colors disabled:opacity-60">
                {t("reviewStepAria")} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" {...anim} className="space-y-4">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">{t("tourField")}</span><span className="font-medium text-stone-900">{tourTitle}</span></div>
              {requestedDate && <div className="flex justify-between"><span className="text-stone-500">{t("dateField")}</span><span>{requestedDate}</span></div>}
              <div className="flex justify-between"><span className="text-stone-500">{t("travelersField")}</span><span>{travelers}</span></div>
              {pickupLocation && <div className="flex justify-between"><span className="text-stone-500">{t("pickupField")}</span><span>{pickupLocation}</span></div>}
              <div className="flex justify-between"><span className="text-stone-500">{t("nameField")}</span><span>{customerName}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">{t("contactField")}</span><span className="truncate max-w-[160px]">{customerContact}</span></div>
              {message && <div><span className="text-stone-500">{t("notesField")}</span><p className="mt-1 text-stone-700 bg-white rounded-lg border border-stone-200 p-2">{message}</p></div>}
            </div>

            {err && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{err}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
                <ArrowLeft size={14} /> {t("backBtn")}
              </button>
              <button type="submit" disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
                {isPending ? t("sending") : t("confirmRequest")} <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-xs text-stone-500 text-center">{t("noChargeNow")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
