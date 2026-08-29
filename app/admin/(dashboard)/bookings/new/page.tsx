"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminNewBookingPage() {
  const { t } = useLang();
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
      <h1 className="font-display text-2xl font-semibold mb-6">{t("adminNavNewBooking")}</h1>

      <div className="max-w-3xl">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-5">{t("adminBookingDetails")}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t("adminCustomerName")} value={form.customer_name} onChange={update("customer_name")} placeholder={t("adminCustomerNamePlaceholder")} required />
              <Input label={t("adminCustomerContact")} value={form.customer_contact} onChange={update("customer_contact")} placeholder="+255..." required />
            </div>

            <Input label={t("adminTour")} value={form.tour_title_snapshot} onChange={update("tour_title_snapshot")} placeholder={t("adminTourNamePlaceholder")} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t("adminRequestedDate")} value={form.requested_date} onChange={update("requested_date")} type="date" />
              <Input label={t("adminPartySize")} value={form.party_size} onChange={update("party_size")} type="number" min="1" />
            </div>

            <Input label={t("adminPickupLocation")} value={form.pickup_location} onChange={update("pickup_location")} placeholder={t("adminOptional")} />

            <Textarea label={t("adminNotesMessage")} value={form.message} onChange={update("message")} rows={4} placeholder={t("adminAnySpecialRequests")} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button size="lg">{t("adminCreateBooking")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}