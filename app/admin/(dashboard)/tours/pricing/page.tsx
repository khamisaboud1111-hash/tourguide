"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminTourPricingPage() {
  const [form, setForm] = useState({
    defaultPricing: "per_person",
    depositPercent: "30",
    vatPercent: "18",
    currency: "USD",
    seasonalEnabled: "true",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Pricing Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Default pricing</h2>
          <div className="space-y-4">
            <Input label="Pricing model" value={form.defaultPricing} onChange={update("defaultPricing")} hint="Per person, per group, or per tour" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Currency" value={form.currency} onChange={update("currency")} />
              <Input label="Default deposit (%)" value={form.depositPercent} onChange={update("depositPercent")} />
            </div>
            <Input label="Tax / VAT (%)" value={form.vatPercent} onChange={update("vatPercent")} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Seasonal pricing</h2>
          <div className="space-y-4">
            <Input label="Enable seasonal pricing" value={form.seasonalEnabled} onChange={update("seasonalEnabled")} hint="Set different prices for peak / off-peak seasons" />
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
              <p className="text-sm text-stone-500">Seasonal multipliers can be set per-tour. Configure peak-season surcharges and off-peak discounts here.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}