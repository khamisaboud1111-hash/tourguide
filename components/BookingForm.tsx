"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CreditCard, ArrowRight, ArrowLeft, Calendar, Users, User, Mail, MessageCircle } from "lucide-react";
import { createBooking } from "@/app/actions/bookings";
import { createPaymentLink } from "@/app/actions/payments";
import { business } from "@/lib/constants";

type Props = {
  tourId?: string;
  tourTitle: string;
  priceUsd?: number;
};

export default function BookingForm({ tourId, tourTitle, priceUsd }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [isPayPending, startPayTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string; bookingId?: string } | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  // form state for controlled validation
  const [requestedDate, setRequestedDate] = useState("");
  const [partySize, setPartySize] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [message, setMessage] = useState("");

  const deposit = priceUsd ? Math.max(1, Math.round(priceUsd * business.depositPercent)) : null;
  const remaining = priceUsd && deposit ? priceUsd - deposit : null;

  function canContinueStep1() {
    // date and partySize optional in DB, but we guide user to fill them
    return true;
  }
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
    formData.set("partySize", partySize);
    formData.set("message", message);

    startTransition(async () => {
      const res = await createBooking(formData);
      setResult(res.ok ? { ok: true, bookingId: res.bookingId } : { ok: false, error: res.error });
      if (res.ok) {
        // reset
        setRequestedDate("");
        setPartySize("");
        // keep name/contact for next booking? clear anyway
      }
    });
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-lagoon-200 bg-lagoon-50 p-5 space-y-4 animate-fade-in">
        <div className="flex gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-600 text-white shrink-0">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="font-display font-semibold text-lagoon-900">Booking request received</p>
            <p className="text-sm text-lagoon-800 mt-1">
              Reference <span className="font-mono font-medium">ZKT-{result.bookingId?.slice(0, 8).toUpperCase()}</span> — you&apos;ll hear back to confirm details and availability shortly.
            </p>
            <ol className="mt-3 text-xs text-lagoon-700 list-decimal list-inside space-y-1">
              <li>Your request has been received.</li>
              <li>The guide will confirm availability.</li>
              <li>You&apos;ll get payment instructions (deposit {business.depositPercent * 100}% online or pay on the day).</li>
              <li>Contact anytime on WhatsApp if you need to adjust.</li>
            </ol>
          </div>
        </div>

        {priceUsd && deposit !== null && (
          <div className="rounded-xl bg-white border border-lagoon-200 p-3 text-sm">
            <div className="flex justify-between"><span className="text-stone-600">Total</span><span className="font-medium">${priceUsd}</span></div>
            <div className="flex justify-between"><span className="text-stone-600">Deposit online</span><span className="font-medium">${deposit}</span></div>
            <div className="flex justify-between font-semibold border-t border-stone-100 mt-2 pt-2"><span>Remaining</span><span>${remaining}</span></div>
          </div>
        )}

        <button
          onClick={handlePayDeposit}
          disabled={isPayPending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lagoon-700 hover:bg-lagoon-800 disabled:opacity-60 transition-colors text-white px-5 py-3 text-sm font-medium shadow-soft"
        >
          <CreditCard size={16} />
          {isPayPending ? "Opening secure checkoutâ€¦" : "Pay deposit online (optional)"}
        </button>
        {payError && <p className="text-xs text-clove-700">{payError}</p>}

        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <a href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Hi ${business.guideName}, I have a question about my booking ZKT-${result.bookingId?.slice(0, 8).toUpperCase()}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lagoon-700 hover:text-lagoon-800">
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
      {/* Step indicator */}
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
            <input id="requestedDate" type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} className={inputBase} />
            <p className="text-xs text-stone-500 mt-1">Flexible? Leave blank and mention preferred window on next step.</p>
          </div>
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Users size={14} className="text-clove-600" /> Travelers
            </label>
            <input id="partySize" type="number" min={1} value={partySize} onChange={(e) => setPartySize(e.target.value)} placeholder="e.g. 2" className={inputBase} />
            <p className="text-xs text-stone-500 mt-1">Private available — just note group size and the guide will adjust.</p>
          </div>

          {priceUsd && deposit !== null && (
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs leading-relaxed">
              <div className="flex justify-between"><span className="text-stone-600">Total</span><span className="font-medium">${priceUsd} / person</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Deposit (online)</span><span className="font-medium">${deposit}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Remaining on day</span><span className="font-medium">${remaining}</span></div>
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
            <input id="customerContact" required value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder="jane@example.com or +255â€¦" className={inputBase} />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">Notes (optional)</label>
            <textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hotel, special requests, questionsâ€¦" className={inputBase} />
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
            {partySize && <div className="flex justify-between"><span className="text-stone-500">Travelers</span><span>{partySize}</span></div>}
            <div className="flex justify-between"><span className="text-stone-500">Name</span><span>{customerName}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Contact</span><span className="truncate max-w-[160px]">{customerContact}</span></div>
            {message && <div><span className="text-stone-500">Notes</span><p className="mt-1 text-stone-700 bg-white rounded-lg border border-stone-200 p-2">{message}</p></div>}
          </div>

          {priceUsd && (
            <div className="rounded-xl bg-white border border-stone-200 p-3 text-sm">
              <div className="flex justify-between"><span>Total</span><span className="font-display font-semibold">${priceUsd}</span></div>
              <div className="flex justify-between text-stone-600"><span>Deposit</span><span>${deposit}</span></div>
              <div className="flex justify-between text-stone-600"><span>Remaining</span><span>${remaining}</span></div>
            </div>
          )}

          {err && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{err}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium hover:border-clove-300 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <button type="submit" disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
              {isPending ? "Sendingâ€¦" : "Confirm request"} <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-stone-500 text-center">No charge now — confirm details with your guide on WhatsApp.</p>
        </div>
      )}
    </form>
  );
}
