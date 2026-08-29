"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminSeoSettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    metaTitle: "AKTIVANZ | Guided Tours in Tanzania",
    metaDescription: "Curated safaris, treks, and cultural experiences across Tanzania. Book your unforgettable adventure today.",
    keywords: "tanzania tours, safari, kilimanjaro, zanzibar",
    ogImage: "/images/og-default.jpg",
    analyticsId: "G-XXXXXXX",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminSeoSettingsTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminMetaTitleLabel")} value={form.metaTitle} onChange={update("metaTitle")} hint={t("adminMetaTitleHint")} />
            <Textarea label={t("adminMetaDescriptionLabel")} value={form.metaDescription} onChange={update("metaDescription")} rows={3} hint={t("adminMetaDescriptionHint")} />
            <Input label={t("adminKeywordsLabel")} value={form.keywords} onChange={update("keywords")} />
            <Input label={t("adminOgImageLabel")} value={form.ogImage} onChange={update("ogImage")} />
            <Input label={t("adminAnalyticsIdLabel")} value={form.analyticsId} onChange={update("analyticsId")} />
          </div>
        </Card>
      </div>
    </div>
  );
}