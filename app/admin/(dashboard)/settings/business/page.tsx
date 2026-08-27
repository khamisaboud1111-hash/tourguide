"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";
import { FloatingInput } from "@/components/ui/FloatingInput";

export default function AdminBusinessSettingsPage() {
  const [form, setForm] = useState({
    name: "AKTIVANZ",
    tagline: "Guided adventures across Tanzania",
    email: "hello@aktivanz.com",
    phone: "+255 700 000 000",
    address: "123 Arusha Road, Moshi, Tanzania",
    currency: "USD",
    timezone: "Africa/Dar_es_Salaam",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Business Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <FloatingInput label="Business Name" value={form.name} onChange={update("name")} />
            <Input label="Tagline" value={form.tagline} onChange={update("tagline")} />
            <FloatingInput label="Email" value={form.email} onChange={update("email")} type="email" />
            <Input label="Phone" value={form.phone} onChange={update("phone")} />
            <Input label="Address" value={form.address} onChange={update("address")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Currency" value={form.currency} onChange={update("currency")} />
              <Input label="Timezone" value={form.timezone} onChange={update("timezone")} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}