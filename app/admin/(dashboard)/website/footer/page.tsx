"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";

export default function AdminFooterCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    about: `${business.name} — ${business.tagline}. ${business.guideBioShort}`,
    facebook: business.facebook,
    instagram: business.instagram,
    whatsapp: `+${business.whatsappNumber}`,
    copyright: `© ${new Date().getFullYear()} ${business.name}. All rights reserved.`,
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminFooterTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

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