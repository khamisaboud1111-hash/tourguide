"use client";

import { useState, useTransition } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { saveBookingSettings } from "@/app/actions/siteSettings";

export default function AdminBookingSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    allowManualBookings: "true",
    minPartySize: "1",
    maxPartySize: "20",
    bookingWindowDays: "90",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("minPartySize", form.minPartySize);
    fd.set("maxPartySize", form.maxPartySize);
    fd.set("bookingWindowDays", form.bookingWindowDays);
    startTransition(async () => {
      try {
        await saveBookingSettings(fd);
        setMsg("Saved — changes are live.");
        setSaved(true);
        setTimeout(() => setSaved(false), 5000);
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminBookingSettingsTitle")}</h1>
        <Button onClick={onSave} loading={isPending} className={saved ? "!bg-emerald-600 !text-white !border-emerald-600" : ""}>{saved ? "✓ Saved" : t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

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