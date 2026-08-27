"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/admin/AdminForms";

export default function AdminNewBookingPage() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_contact: "",
    tour_title_snapshot: "",
    requested_date: "",
    party_size: "2",
    pickup_location: "",
    message: "",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">New Booking</h1>

      <div className="max-w-3xl">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-5">Booking details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Customer name" value={form.customer_name} onChange={update("customer_name")} placeholder="e.g. John Doe" required />
              <Input label="Customer contact (phone/email)" value={form.customer_contact} onChange={update("customer_contact")} placeholder="+255..." required />
            </div>

            <Input label="Tour" value={form.tour_title_snapshot} onChange={update("tour_title_snapshot")} placeholder="Select or enter tour name" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Requested date" value={form.requested_date} onChange={update("requested_date")} type="date" />
              <Input label="Party size" value={form.party_size} onChange={update("party_size")} type="number" min="1" />
            </div>

            <Input label="Pickup location" value={form.pickup_location} onChange={update("pickup_location")} placeholder="Optional" />

            <Textarea label="Notes / message" value={form.message} onChange={update("message")} rows={4} placeholder="Any special requests" />
          </div>

          <div className="mt-6 flex justify-end">
            <Button size="lg">Create booking</Button>
          </div>
        </div>
      </div>
    </div>
  );
}