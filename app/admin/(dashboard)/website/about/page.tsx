"use client";

import { useState, useTransition } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";
import { saveAboutSettings } from "@/app/actions/siteSettings";

export default function AdminAboutCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    title: `About ${business.name}`,
    intro: business.guideBioShort,
    story: `Born and raised in Stone Town, ${business.guideName} has guided visitors through Zanzibar's alleys, spice farms and reefs for years — sharing the island the way locals live it, not the way brochures sell it.`,
    mission: business.tagline,
    values: "Local knowledge • Small groups • Direct contact",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("intro", form.intro);
    fd.set("story", form.story);
    fd.set("mission", form.mission);
    fd.set("values", form.values);
    startTransition(async () => {
      try {
        await saveAboutSettings(fd);
        setMsg("Saved — changes are live.");
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminAboutPageTitle")}</h1>
        <Button onClick={onSave} loading={isPending}>{t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminPageTitleLabel")} value={form.title} onChange={update("title")} />
            <Textarea label={t("adminIntroductionLabel")} value={form.intro} onChange={update("intro")} rows={3} />
            <Textarea label={t("adminOurStoryLabel")} value={form.story} onChange={update("story")} rows={4} />
            <Textarea label={t("adminMissionLabel")} value={form.mission} onChange={update("mission")} rows={3} />
            <Input label={t("adminOurValuesLabel")} value={form.values} onChange={update("values")} hint={t("adminValuesSeparatorHint")} />
          </div>
        </Card>
      </div>
    </div>
  );
}