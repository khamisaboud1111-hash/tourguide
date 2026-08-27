"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminBookingSettingsPage() {
  const [form, setForm] = useState({
    depositPercent: "30",
    allowManualBookings: "true",
    minPartySize: "1",
    maxPartySize: "20",
    bookingWindowDays: "90",
    requireDeposit: "true",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Booking Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Default Deposit (%)" value={form.depositPercent} onChange={update("depositPercent")} hint="Percent of total charged as deposit" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min party size" value={form.minPartySize} onChange={update("minPartySize")} />
              <Input label="Max party size" value={form.maxPartySize} onChange={update("maxPartySize")} />
            </div>
            <Input label="Booking window (days)" value={form.bookingWindowDays} onChange={update("bookingWindowDays")} />
            <Input label="Require deposit" value={form.requireDeposit} onChange={update("requireDeposit")} />
          </div>
        </Card>
      </div>
    </div>
  );
}