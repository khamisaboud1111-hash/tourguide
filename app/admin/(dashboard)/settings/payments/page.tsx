"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminPaymentSettingsPage() {
  const [form, setForm] = useState({
    paymentProvider: "stripe",
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    acceptLocalPayment: "true",
    localProvider: "vodacom_mpesa",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Payment Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Payment Provider" value={form.paymentProvider} onChange={update("paymentProvider")} />
            <Input label="Stripe Publishable Key" value={form.stripePublicKey} onChange={update("stripePublicKey")} type="password" />
            <Input label="Stripe Secret Key" value={form.stripeSecretKey} onChange={update("stripeSecretKey")} type="password" />
            <Input label="Accept local payments" value={form.acceptLocalPayment} onChange={update("acceptLocalPayment")} />
            <Input label="Local provider" value={form.localProvider} onChange={update("localProvider")} />
          </div>
        </Card>
      </div>
    </div>
  );
}