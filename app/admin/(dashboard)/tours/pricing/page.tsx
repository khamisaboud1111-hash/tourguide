"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminTourPricingPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    defaultPricing: "per_person",
    vatPercent: "18",
    currency: "USD",
    seasonalEnabled: "true",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminPricingSettings")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminDefaultPricing")}</h2>
          <div className="space-y-4">
            <Input label={t("adminPricingModel")} value={form.defaultPricing} onChange={update("defaultPricing")} hint={t("adminPricingModelHint")} />
            <Input label={t("adminCurrency")} value={form.currency} onChange={update("currency")} />
            <Input label={t("adminTaxVat")} value={form.vatPercent} onChange={update("vatPercent")} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminSeasonalPricing")}</h2>
          <div className="space-y-4">
            <Input label={t("adminEnableSeasonalPricing")} value={form.seasonalEnabled} onChange={update("seasonalEnabled")} hint={t("adminSeasonalPricingHint")} />
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
              <p className="text-sm text-stone-500">{t("adminSeasonalMultipliersNote")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}