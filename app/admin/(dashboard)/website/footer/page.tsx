"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminFooterCmsPage() {
  const [form, setForm] = useState({
    about: "AKTIVANZ — Guided adventures across Tanzania.",
    facebook: "https://facebook.com/aktivanz",
    instagram: "https://instagram.com/aktivanz",
    whatsapp: "+255700000000",
    copyright: "© 2026 AKTIVANZ. All rights reserved.",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Footer</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="About Text" value={form.about} onChange={update("about")} />
            <Input label="Facebook URL" value={form.facebook} onChange={update("facebook")} />
            <Input label="Instagram URL" value={form.instagram} onChange={update("instagram")} />
            <Input label="WhatsApp Number" value={form.whatsapp} onChange={update("whatsapp")} />
            <Input label="Copyright Text" value={form.copyright} onChange={update("copyright")} />
          </div>
        </Card>
      </div>
    </div>
  );
}