"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";

export default function AdminHomepageCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    heroTitle: "See Zanzibar the way locals do",
    heroSubtitle: `${business.tagline} — small groups, flexible days, routes that change with the sea and the season.`,
    heroCta: "Explore experiences",
    aboutTitle: `Why travel with ${business.guideName}`,
    aboutBody: business.guideBioShort,
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminHomepageTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminHeroSectionTitle")}</h2>
          <div className="space-y-4">
            <Input label={t("adminHeroTitleLabel")} value={form.heroTitle} onChange={update("heroTitle")} />
            <Textarea label={t("adminHeroSubtitleLabel")} value={form.heroSubtitle} onChange={update("heroSubtitle")} rows={3} />
            <Input label={t("adminHeroCtaLabel")} value={form.heroCta} onChange={update("heroCta")} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminAboutSectionTitle")}</h2>
          <div className="space-y-4">
            <Input label={t("adminAboutTitleLabel")} value={form.aboutTitle} onChange={update("aboutTitle")} />
            <Textarea label={t("adminAboutBodyLabel")} value={form.aboutBody} onChange={update("aboutBody")} rows={4} />
          </div>
        </Card>
      </div>
    </div>
  );
}