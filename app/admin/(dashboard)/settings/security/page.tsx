"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

export default function AdminSecuritySettingsPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    twoFactorAuth: "false",
    sessionTimeout: "30",
    passwordMinLength: "8",
    allowOtp: "true",
  });

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminSecuritySettingsTitle")}</h1>
        <Button>{t("adminSaveChanges")}</Button>
      </div>

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