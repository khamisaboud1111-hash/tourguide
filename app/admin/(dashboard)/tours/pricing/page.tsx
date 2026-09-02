"use client";

import { useState, useTransition } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { savePricingSettings } from "@/app/actions/siteSettings";

export default function AdminTourPricingPage() {
  const { t } = useLang();
  const currencies = [
    { code: "USD", label: "USD — US Dollar", symbol: "$" },
    { code: "TZS", label: "TZS — Tanzanian Shilling", symbol: "TSh" },
    { code: "EUR", label: "EUR — Euro", symbol: "€" },
    { code: "GBP", label: "GBP — British Pound", symbol: "£" },
    { code: "KES", label: "KES — Kenyan Shilling", symbol: "KSh" },
    { code: "ZAR", label: "ZAR — South African Rand", symbol: "R" },
    { code: "UGX", label: "UGX — Ugandan Shilling", symbol: "USh" },
    { code: "RWF", label: "RWF — Rwandan Franc", symbol: "RF" },
    { code: "ETB", label: "ETB — Ethiopian Birr", symbol: "Br" },
    { code: "JPY", label: "JPY — Japanese Yen", symbol: "¥" },
    { code: "CNY", label: "CNY — Chinese Yuan", symbol: "¥" },
    { code: "INR", label: "INR — Indian Rupee", symbol: "₹" },
    { code: "AUD", label: "AUD — Australian Dollar", symbol: "A$" },
    { code: "CAD", label: "CAD — Canadian Dollar", symbol: "C$" },
    { code: "CHF", label: "CHF — Swiss Franc", symbol: "Fr" },
    { code: "NZD", label: "NZD — New Zealand Dollar", symbol: "NZ$" },
    { code: "AED", label: "AED — UAE Dirham", symbol: "AED" },
    { code: "SAR", label: "SAR — Saudi Riyal", symbol: "﷼" },
    { code: "QAR", label: "QAR — Qatari Riyal", symbol: "QR" },
    { code: "OMR", label: "OMR — Omani Rial", symbol: "﷼" },
    { code: "BHD", label: "BHD — Bahraini Dinar", symbol: "BD" },
    { code: "KWD", label: "KWD — Kuwaiti Dinar", symbol: "KD" },
    { code: "TRY", label: "TRY — Turkish Lira", symbol: "₺" },
    { code: "SEK", label: "SEK — Swedish Krona", symbol: "kr" },
    { code: "NOK", label: "NOK — Norwegian Krone", symbol: "kr" },
    { code: "DKK", label: "DKK — Danish Krone", symbol: "kr" },
    { code: "ZAR", label: "ZAR — South African Rand", symbol: "R" },
    { code: "BRL", label: "BRL — Brazilian Real", symbol: "R$" },
    { code: "MXN", label: "MXN — Mexican Peso", symbol: "$" },
    { code: "SGD", label: "SGD — Singapore Dollar", symbol: "S$" },
    { code: "HKD", label: "HKD — Hong Kong Dollar", symbol: "HK$" },
  ];
  const [form, setForm] = useState({
    defaultPricing: "per_person",
    vatPercent: "18",
    currency: "USD",
    seasonalEnabled: "true",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("defaultPricing", form.defaultPricing);
    fd.set("currency", form.currency);
    fd.set("vatPercent", form.vatPercent);
    fd.set("seasonalEnabled", form.seasonalEnabled);
    startTransition(async () => {
      try {
        await savePricingSettings(fd);
        setMsg("Saved — changes are live.");
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminPricingSettings")}</h1>
        <Button onClick={onSave} loading={isPending}>{t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

      <div className="max-w-3xl space-y-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">{t("adminDefaultPricing")}</h2>
          <div className="space-y-4">
            <Input label={t("adminPricingModel")} value={form.defaultPricing} onChange={update("defaultPricing")} hint={t("adminPricingModelHint")} />
            <label className="block">
              <span className="block text-sm font-medium text-stone-700 mb-1.5">{t("adminCurrency")}</span>
              <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500">
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-stone-500">Symbol: {currencies.find((c) => c.code === form.currency)?.symbol ?? "$"} — admin can choose any currency, symbol shows live</p>
            </label>
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