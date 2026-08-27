"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/admin/AdminForms";

export default function AdminAboutCmsPage() {
  const [form, setForm] = useState({
    title: "About Us",
    intro: "We are a dedicated team of local guides and travel experts.",
    story: "Founded in 2015, we've taken thousands of travelers on unforgettable journeys.",
    mission: "To share the beauty of Tanzania while supporting local communities.",
    values: "Sustainability • Authenticity • Excellence",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">About Page</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Page Title" value={form.title} onChange={update("title")} />
            <Textarea label="Introduction" value={form.intro} onChange={update("intro")} rows={3} />
            <Textarea label="Our Story" value={form.story} onChange={update("story")} rows={4} />
            <Textarea label="Mission" value={form.mission} onChange={update("mission")} rows={3} />
            <Input label="Our Values" value={form.values} onChange={update("values")} hint="Separate values with bullets (•)" />
          </div>
        </Card>
      </div>
    </div>
  );
}