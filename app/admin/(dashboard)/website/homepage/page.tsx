"use client";

import { useState, useTransition } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveHomepageSettings } from "@/app/actions/siteSettings";
import { uploadMedia } from "@/app/actions/media";

export default function AdminHomepageCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    heroTitle: "See Zanzibar the way locals do",
    heroSubtitle: `${business.tagline} — small groups, flexible days, routes that change with the sea and the season.`,
    heroCta: "Explore experiences",
    heroImageSeed: "hero-dhow-sunset",
    aboutTitle: `Why travel with ${business.guideName}`,
    aboutBody: business.guideBioShort,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("heroTitle", form.heroTitle);
    fd.set("heroSubtitle", form.heroSubtitle);
    fd.set("heroCta", form.heroCta);
    fd.set("heroImageSeed", form.heroImageSeed);
    fd.set("aboutTitle", form.aboutTitle);
    fd.set("aboutBody", form.aboutBody);
    startTransition(async () => {
      try {
        await saveHomepageSettings(fd);
        setMsg("Saved — changes are live.");
        setSaved(true);
        setTimeout(() => setSaved(false), 5000);
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  const onHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "Hero");
    fd.set("altText", "Hero image");
    startTransition(async () => {
      try {
        const res = await uploadMedia(fd);
        setForm((f) => ({ ...f, heroImageSeed: res.url }));
        setMsg("Hero image uploaded — click Save to apply.");
      } catch (err: unknown) {
        setMsg(err instanceof Error ? err.message : "Hero upload failed");
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
            <Input label="Hero image seed or URL" value={form.heroImageSeed} onChange={update("heroImageSeed")} hint="Use a seed like hero-dhow-sunset or upload below — URL will be saved" />
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Upload new hero image</label>
              <input type="file" accept="image/*" onChange={onHeroUpload} className="w-full text-sm border border-stone-300 rounded-xl px-3 py-2 bg-stone-50" />
              <p className="text-xs text-stone-500 mt-1">Uploads to Media/Hero and sets hero to that image. Click Save after upload.</p>
            </div>
            {form.heroImageSeed.startsWith("http") && (
              <div className="rounded-xl overflow-hidden border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.heroImageSeed} alt="hero preview" className="w-full h-32 object-cover" />
              </div>
            )}
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