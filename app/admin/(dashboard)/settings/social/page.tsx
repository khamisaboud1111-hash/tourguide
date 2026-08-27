"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminSocialSettingsPage() {
  const [form, setForm] = useState({
    facebook: "https://facebook.com/aktivanz",
    instagram: "https://instagram.com/aktivanz",
    twitter: "https://twitter.com/aktivanz",
    youtube: "https://youtube.com/@aktivanz",
    whatsapp: "+255700000000",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Social Links</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Facebook" value={form.facebook} onChange={update("facebook")} />
            <Input label="Instagram" value={form.instagram} onChange={update("instagram")} />
            <Input label="Twitter / X" value={form.twitter} onChange={update("twitter")} />
            <Input label="YouTube" value={form.youtube} onChange={update("youtube")} />
            <Input label="WhatsApp Number" value={form.whatsapp} onChange={update("whatsapp")} />
          </div>
        </Card>
      </div>
    </div>
  );
}