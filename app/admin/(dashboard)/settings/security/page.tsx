"use client";

import { useState, useTransition } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";
import { saveSecuritySettings } from "@/app/actions/siteSettings";

export default function AdminSecuritySettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    twoFactorAuth: "false",
    sessionTimeout: "30",
    passwordMinLength: "8",
    allowOtp: "true",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("twoFactorAuth", form.twoFactorAuth);
    fd.set("sessionTimeout", form.sessionTimeout);
    fd.set("passwordMinLength", form.passwordMinLength);
    fd.set("allowOtp", form.allowOtp);
    startTransition(async () => {
      try {
        await saveSecuritySettings(fd);
        setMsg("Saved — changes are live.");
        setSaved(true);
        setTimeout(() => setSaved(false), 5000);
      } catch (e: unknown) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminSecuritySettingsTitle")}</h1>
        <Button onClick={onSave} loading={isPending} className={saved ? "!bg-emerald-600 !text-white !border-emerald-600" : ""}>{saved ? "✓ Saved" : t("adminSaveChanges")}</Button>
      </div>
      {msg && <p className={`mb-4 text-sm px-3 py-2 rounded-lg ${msg.includes("Saved") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>{msg}</p>}

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label={t("adminTwoFactorAuthLabel")} value={form.twoFactorAuth} onChange={update("twoFactorAuth")} hint={t("adminTwoFactorAuthHint")} />
            <Input label={t("adminSessionTimeoutLabel")} value={form.sessionTimeout} onChange={update("sessionTimeout")} />
            <Input label={t("adminPasswordMinLengthLabel")} value={form.passwordMinLength} onChange={update("passwordMinLength")} />
            <Input label={t("adminAllowOtpLabel")} value={form.allowOtp} onChange={update("allowOtp")} />
          </div>
        </Card>
      </div>
    </div>
  );
}