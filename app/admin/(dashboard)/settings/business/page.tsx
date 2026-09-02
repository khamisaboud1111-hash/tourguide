"use client";

import { useState, useTransition } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveBusinessSettings } from "@/app/actions/siteSettings";

export default function AdminBusinessSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: business.name,
    tagline: business.tagline,
    email: business.email,
    phone: business.phoneDisplay,
    address: business.location,
    currency: "USD",
    timezone: "Africa/Dar_es_Salaam",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("tagline", form.tagline);
    fd.set("email", form.email);
    fd.set("phone", form.phone);
    fd.set("address", form.address);
    startTransition(async () => {
      try {
        await saveBusinessSettings(fd);
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
        <h1 className="font-display text-2xl font-semibold">{t("adminBusinessSettingsTitle")}</h1>
        <Button onClick={onSave} loading={isPending} className={saved ? "!bg-emerald-600 !text-white !border-emerald-600" : ""}>{saved ? "✓ Saved" : t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

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