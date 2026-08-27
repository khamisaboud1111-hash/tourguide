"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";

export default function AdminSeoSettingsPage() {
  const [form, setForm] = useState({
    metaTitle: "AKTIVANZ | Guided Tours in Tanzania",
    metaDescription: "Curated safaris, treks, and cultural experiences across Tanzania. Book your unforgettable adventure today.",
    keywords: "tanzania tours, safari, kilimanjaro, zanzibar",
    ogImage: "/images/og-default.jpg",
    analyticsId: "G-XXXXXXX",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">SEO Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Meta Title" value={form.metaTitle} onChange={update("metaTitle")} hint="Recommend 50–60 characters" />
            <Textarea label="Meta Description" value={form.metaDescription} onChange={update("metaDescription")} rows={3} hint="Recommend 150–160 characters" />
            <Input label="Keywords" value={form.keywords} onChange={update("keywords")} />
            <Input label="Open Graph Image" value={form.ogImage} onChange={update("ogImage")} />
            <Input label="Google Analytics ID" value={form.analyticsId} onChange={update("analyticsId")} />
          </div>
        </Card>
      </div>
    </div>
  );
}