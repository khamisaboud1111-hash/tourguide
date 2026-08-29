"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { useLang } from "@/lib/i18n/context";

export default function AdminBusinessSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "AKTIVANZ",
    tagline: "Guided adventures across Tanzania",
    email: "hello@aktivanz.com",
    phone: "+255 700 000 000",
    address: "123 Arusha Road, Moshi, Tanzania",
    currency: "USD",
    timezone: "Africa/Dar_es_Salaam",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminBusinessSettingsTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <FloatingInput label={t("adminBusinessNameLabel")} value={form.name} onChange={update("name")} />
            <Input label={t("adminTaglineLabel")} value={form.tagline} onChange={update("tagline")} />
            <FloatingInput label={t("adminEmailLabel")} value={form.email} onChange={update("email")} type="email" />
            <Input label={t("adminPhoneLabel")} value={form.phone} onChange={update("phone")} />
            <Input label={t("adminAddressLabel")} value={form.address} onChange={update("address")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t("adminCurrencyLabel")} value={form.currency} onChange={update("currency")} />
              <Input label={t("adminTimezoneLabel")} value={form.timezone} onChange={update("timezone")} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}