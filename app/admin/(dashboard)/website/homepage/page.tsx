"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";

export default function AdminHomepageCmsPage() {
  const [form, setForm] = useState({
    heroTitle: "Experience Tanzania Like Never Before",
    heroSubtitle: "Curated tours through the heart of East Africa",
    heroCta: "Explore Tours",
    aboutTitle: "Who We Are",
    aboutBody: "We craft unforgettable safaris, treks, and cultural experiences across Tanzania.",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Homepage</h1>
        <Button>Save changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <Input label="Hero Title" value={form.heroTitle} onChange={update("heroTitle")} />
            <Textarea label="Hero Subtitle" value={form.heroSubtitle} onChange={update("heroSubtitle")} rows={3} />
            <Input label="Hero CTA Button" value={form.heroCta} onChange={update("heroCta")} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">About Section</h2>
          <div className="space-y-4">
            <Input label="About Title" value={form.aboutTitle} onChange={update("aboutTitle")} />
            <Textarea label="About Body" value={form.aboutBody} onChange={update("aboutBody")} rows={4} />
          </div>
        </Card>
      </div>
    </div>
  );
}