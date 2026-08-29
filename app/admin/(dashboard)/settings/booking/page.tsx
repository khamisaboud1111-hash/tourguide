"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminBookingSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    allowManualBookings: "true",
    minPartySize: "1",
    maxPartySize: "20",
    bookingWindowDays: "90",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminBookingSettingsTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label={t("adminMinPartySizeLabel")} value={form.minPartySize} onChange={update("minPartySize")} />
              <Input label={t("adminMaxPartySizeLabel")} value={form.maxPartySize} onChange={update("maxPartySize")} />
            </div>
            <Input label={t("adminBookingWindowDaysLabel")} value={form.bookingWindowDays} onChange={update("bookingWindowDays")} />
          </div>
        </Card>
      </div>
    </div>
  );
}