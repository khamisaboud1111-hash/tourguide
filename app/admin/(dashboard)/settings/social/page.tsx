"use client";

import { useState, useTransition } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveSocialSettings } from "@/app/actions/siteSettings";

export default function AdminSocialSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    facebook: business.facebook,
    instagram: business.instagram,
    twitter: `https://twitter.com/${business.name.replace(/\s+/g, "").toLowerCase()}`,
    youtube: business.tiktok.replace("tiktok.com", "youtube.com"),
    whatsapp: `+${business.whatsappNumber}`,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("facebook", form.facebook);
    fd.set("instagram", form.instagram);
    fd.set("twitter", form.twitter);
    fd.set("youtube", form.youtube);
    fd.set("whatsapp", form.whatsapp);
    startTransition(async () => {
      try {
        await saveSocialSettings(fd);
        setMsg("Saved — changes are live.");
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminSocialLinksTitle")}</h1>
        <Button onClick={onSave} loading={isPending}>{t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminFacebookLabel")} value={form.facebook} onChange={update("facebook")} />
            <Input label={t("adminInstagramLabel")} value={form.instagram} onChange={update("instagram")} />
            <Input label={t("adminTwitterLabel")} value={form.twitter} onChange={update("twitter")} />
            <Input label={t("adminYoutubeLabel")} value={form.youtube} onChange={update("youtube")} />
            <Input label={t("adminWhatsAppNumberLabel")} value={form.whatsapp} onChange={update("whatsapp")} />
          </div>
        </Card>
      </div>
    </div>
  );
}