"use client";

import { useState, useTransition } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveHomepageSettings } from "@/app/actions/siteSettings";

export default function AdminHomepageCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    heroTitle: "See Zanzibar the way locals do",
    heroSubtitle: `${business.tagline} — small groups, flexible days, routes that change with the sea and the season.`,
    heroCta: "Explore experiences",
    aboutTitle: `Why travel with ${business.guideName}`,
    aboutBody: business.guideBioShort,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("heroTitle", form.heroTitle);
    fd.set("heroSubtitle", form.heroSubtitle);
    fd.set("heroCta", form.heroCta);
    fd.set("aboutTitle", form.aboutTitle);
    fd.set("aboutBody", form.aboutBody);
    startTransition(async () => {
      try {
        await saveHomepageSettings(fd);
        setMsg("Saved — changes are live.");
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminHomepageTitle")}</h1>
        <Button onClick={onSave} loading={isPending}>{t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

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