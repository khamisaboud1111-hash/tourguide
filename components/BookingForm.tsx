"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CreditCard, ArrowRight, ArrowLeft, Calendar, Users, User, Mail, MessageCircle, MapPin } from "lucide-react";
import { createBooking } from "@/app/actions/bookings";
import { createPaymentLink } from "@/app/actions/payments";
import { business } from "@/lib/constants";
import { PICKUP_LOCATIONS } from "@/lib/validations";
import { calculateBookingPrice } from "@/lib/pricing";

type Props = {
  tourId?: string;
  tourTitle: string;
  priceUsd?: number;
};

export default function BookingForm({ tourId, tourTitle, priceUsd }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [isPayPending, startPayTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string; bookingId?: string; reference?: string } | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const [requestedDate, setRequestedDate] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [message, setMessage] = useState("");

  // Client preview only — server recalculates authoritatively via calculateBookingPrice
  const travelers = Math.max(1, parseInt(partySize) || 1);
  const preview = priceUsd ? calculateBookingPrice(priceUsd, travelers, business.depositPercent) : null;

  function canContinueStep2() {
    return customerName.trim().length >= 2 && customerContact.trim().length >= 3;
  }

  function handlePayDeposit() {
    if (!result?.bookingId) return;
    setPayError(null);
    startPayTransition(async () => {
      const res = await createPaymentLink(result.bookingId!);
      if (res.ok) window.location.href = res.link;
      else setPayError(res.error);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("tourId", tourId ?? "");
    formData.set("tourTitleSnapshot", tourTitle);
    formData.set("customerName", customerName);
    formData.set("customerContact", customerContact);
    formData.set("requestedDate", requestedDate);
    formData.set("partySize", String(travelers));
    formData.set("pickupLocation", pickupLocation);
    formData.set("pickupNotes", pickupNotes);
    formData.set("message", message);

    startTransition(async () => {
      const res = await createBooking(formData);
      if (res.ok) setResult({ ok: true, bookingId: res.bookingId, reference: res.reference });
      else setResult({ ok: false, error: res.error });
    });
  }

  if (result?.ok) {
    const ref = result.reference ?? "";
    return (
      <div className="rounded-2xl border border-lagoon-200 bg-lagoon-50 p-5 space-y-4 animate-fade-in">
        <div className="flex gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-600 text-white shrink-0">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="font-display font-semibold text-lagoon-900">Booking request received</p>
            <p className="text-sm text-lagoon-800 mt-1">
              Reference <span className="font-mono font-semibold">{ref}</span> — you&apos;ll hear back to confirm details and availability shortly.
            </p>
          </div>
        </div>

        {preview && (
          <div className="rounded-xl bg-white border border-lagoon-200 p-3 text-sm">
            <div className="flex justify-between"><span className="text-stone-600">Subtotal ({preview.travelers} × ${preview.pricePerPerson})</span><span className="font-medium">${preview.subtotal}</span></div>
            <div className="flex justify-between"><span className="text-stone-600">Deposit online</span><span className="font-medium">${preview.deposit}</span></div>
            <div className="flex justify-between font-semibold border-t border-stone-100 mt-2 pt-2"><span>Remaining</span><span>${preview.remaining}</span></div>
          </div>
        )}

        <button
          onClick={handlePayDeposit}
          disabled={isPayPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lagoon-700 hover:bg-lagoon-800 disabled:opacity-60 transition-colors text-white px-5 py-3 text-sm font-medium shadow-soft"
        >
          <CreditCard size={16} />
          {isPayPending ? "Opening secure checkout…" : "Pay deposit online (optional)"}
        </button>
        {payError && <p className="text-xs text-clove-700">{payError}</p>}

        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <a href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Hi ${business.guideName}, I have a question about my booking ${ref}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lagoon-700 hover:text-lagoon-800">
            <MessageCircle size={14} /> WhatsApp
          </a>
          <span className="text-stone-300">·</span>
          <a href="/tours" className="text-lagoon-700 hover:text-lagoon-800">Back to tours</a>
        </div>
      </div>
    );
  }

  const inputBase = "w-full rounded-xl border bg-stone-50 px-4 py-3 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 transition-colors";
  const err = result && !result.ok ? result.error : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span className={`h-7 w-7 rounded-full inline-flex items-center justify-center text-xs font-medium border ${step >= s ? "bg-clove-600 text-white border-clove-600" : "bg-stone-100 text-stone-500 border-stone-200"}`}>
              {s}
            </span>
            <span className={`hidden sm:block text-xs ${step === s ? "text-clove-700 font-medium" : "text-stone-500"}`}>
              {s === 1 ? "Date" : s === 2 ? "Details" : "Review"}
            </span>
            {s !== 3 && <span className={`flex-1 h-px ${step > s ? "bg-clove-300" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3 animate-fade-in">
          <div>
            <label htmlFor="requestedDate" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-clove-600" /> When would you like to go?
            </label>
            <input id="requestedDate" type="date" required value={requestedDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setRequestedDate(e.target.value)} className={inputBase} />
          </div>
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Users size={14} className="text-clove-600" /> Travelers
            </label>
            <input id="partySize" type="number" min={1} max={20} required value={partySize} onChange={(e) => setPartySize(e.target.value)} className={inputBase} />
          </div>
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-clove-600" /> Pickup area (optional)
            </label>
            <select id="pickup" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputBase}>
              <option value="">Not sure yet</option>
              {PICKUP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            {pickupLocation === "Other" && (
              <input value={pickupNotes} onChange={(e) => setPickupNotes(e.target.value)} placeholder="Hotel / area name…" className={`${inputBase} mt-2`} />
            )}
          </div>

          {preview && (
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs leading-relaxed">
              <div className="flex justify-between"><span className="text-stone-600">{preview.travelers} × ${preview.pricePerPerson}</span><span className="font-medium">${preview.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Deposit (online)</span><span className="font-medium">${preview.deposit}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Remaining on day</span><span className="font-medium">${preview.remaining}</span></div>
            </div>
          )}

          <button type="button" onClick={() => setStep(2)} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 font-medium hover:bg-stone-800 transition-colors">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 animate-fade-in">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><User size={14} className="text-clove-600" /> Your name</label>
            <input id="customerName" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Traveler" className={inputBase} />
          </div>
          <div>
            <label htmlFor="customerContact" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5"><Mail size={14} className="text-clove-600" /> Email or phone</label>
            <input id="customerContact" required value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder="jane@example.com or +255…" className={inputBase} />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">Notes (optional)</label>
            <textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hotel name, special requests, questions…" className={inputBase} />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <button type="button" disabled={!canContinueStep2()} onClick={() => setStep(3)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 font-medium hover:bg-stone-800 transition-colors disabled:opacity-60">
              Review <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Tour</span><span className="font-medium text-stone-900">{tourTitle}</span></div>
            {requestedDate && <div className="flex justify-between"><span className="text-stone-500">Date</span><span>{requestedDate}</span></div>}
            <div className="flex justify-between"><span className="text-stone-500">Travelers</span><span>{travelers}</span></div>
            {pickupLocation && <div className="flex justify-between"><span className="text-stone-500">Pickup</span><span>{pickupLocation}</span></div>}
            <div className="flex justify-between"><span className="text-stone-500">Name</span><span>{customerName}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Contact</span><span className="truncate max-w-[160px]">{customerContact}</span></div>
            {message && <div><span className="text-stone-500">Notes</span><p className="mt-1 text-stone-700 bg-white rounded-lg border border-stone-200 p-2">{message}</p></div>}
          </div>

          {preview && (
            <div className="rounded-xl bg-white border border-stone-200 p-3 text-sm">
              <div className="flex justify-between"><span>Subtotal ({preview.travelers} × ${preview.pricePerPerson})</span><span className="font-display font-semibold">${preview.subtotal}</span></div>
              <div className="flex justify-between text-stone-600"><span>Deposit</span><span>${preview.deposit}</span></div>
              <div className="flex justify-between text-stone-600"><span>Remaining</span><span>${preview.remaining}</span></div>
            </div>
          )}

          {err && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{err}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <button type="submit" disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
              {isPending ? "Sending…" : "Confirm request"} <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-stone-500 text-center">No charge now — confirm details with your guide on WhatsApp.</p>
        </div>
      )}
    </form>
  );
}
