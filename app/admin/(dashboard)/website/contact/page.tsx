"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminContactCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    heading: "Get in Touch",
    email: "hello@aktivanz.com",
    phone: "+255 700 000 000",
    address: "123 Arusha Road, Moshi, Tanzania",
    hours: "Mon–Sat, 9am–6pm EAT",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminContactPageTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminHeadingLabel")} value={form.heading} onChange={update("heading")} />
            <Input label={t("adminEmailLabel")} value={form.email} onChange={update("email")} type="email" />
            <Input label={t("adminPhoneLabel")} value={form.phone} onChange={update("phone")} />
            <Input label={t("adminAddressLabel")} value={form.address} onChange={update("address")} />
            <Input label={t("adminBusinessHoursLabel")} value={form.hours} onChange={update("hours")} />
          </div>
        </Card>
      </div>
    </div>
  );
}