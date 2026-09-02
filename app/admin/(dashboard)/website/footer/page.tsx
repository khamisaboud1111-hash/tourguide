"use client";

import { useState, useTransition } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveFooterSettings } from "@/app/actions/siteSettings";

export default function AdminFooterCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    about: `${business.name} — ${business.tagline}. ${business.guideBioShort}`,
    facebook: business.facebook,
    instagram: business.instagram,
    whatsapp: `+${business.whatsappNumber}`,
    copyright: `© ${new Date().getFullYear()} ${business.name}. All rights reserved.`,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("about", form.about);
    fd.set("facebook", form.facebook);
    fd.set("instagram", form.instagram);
    fd.set("whatsapp", form.whatsapp);
    fd.set("copyright", form.copyright);
    startTransition(async () => {
      try {
        await saveFooterSettings(fd);
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
        <h1 className="font-display text-2xl font-semibold">{t("adminFooterTitle")}</h1>
        <Button onClick={onSave} loading={isPending} className={saved ? "!bg-emerald-600 !text-white !border-emerald-600" : ""}>{saved ? "✓ Saved" : t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminAboutTextLabel")} value={form.about} onChange={update("about")} />
            <Input label={t("adminFacebookUrlLabel")} value={form.facebook} onChange={update("facebook")} />
            <Input label={t("adminInstagramUrlLabel")} value={form.instagram} onChange={update("instagram")} />
            <Input label={t("adminWhatsAppNumberLabel")} value={form.whatsapp} onChange={update("whatsapp")} />
            <Input label={t("adminCopyrightTextLabel")} value={form.copyright} onChange={update("copyright")} />
          </div>
        </Card>
      </div>
    </div>
  );
}