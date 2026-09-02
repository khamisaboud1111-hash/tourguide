"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { business } from "@/lib/constants";

export default function AdminAboutCmsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    title: `About ${business.name}`,
    intro: business.guideBioShort,
    story: `Born and raised in Stone Town, ${business.guideName} has guided visitors through Zanzibar's alleys, spice farms and reefs for years — sharing the island the way locals live it, not the way brochures sell it.`,
    mission: business.tagline,
    values: "Local knowledge • Small groups • Direct contact",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminAboutPageTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

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