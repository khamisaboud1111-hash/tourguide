"use client";

import { useState, useTransition } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveContactSettings } from "@/app/actions/siteSettings";

export default function AdminContactCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    heading: "Get in Touch",
    email: business.email,
    phone: business.phoneDisplay,
    address: business.location,
    hours: "Mon–Sat, 9am–6pm EAT · Stone Town",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("heading", form.heading);
    fd.set("email", form.email);
    fd.set("phone", form.phone);
    fd.set("address", form.address);
    fd.set("hours", form.hours);
    startTransition(async () => {
      try {
        await saveContactSettings(fd);
        setMsg("Saved — changes are live.");
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminContactPageTitle")}</h1>
        <Button onClick={onSave} loading={isPending}>{t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

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