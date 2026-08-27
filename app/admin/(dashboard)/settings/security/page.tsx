"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/admin/AdminForms";

export default function AdminSecuritySettingsPage() {
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
        <h1 className="font-display text-2xl font-semibold">Security Settings</h1>
        <Button>Save changes</Button>
      </div>

      <div className="max-w-3xl">
        <Card>
          <div className="space-y-4">
            <Input label="Two-Factor Authentication" value={form.twoFactorAuth} onChange={update("twoFactorAuth")} hint="Require 2FA for admin logins" />
            <Input label="Session timeout (minutes)" value={form.sessionTimeout} onChange={update("sessionTimeout")} />
            <Input label="Min password length" value={form.passwordMinLength} onChange={update("passwordMinLength")} />
            <Input label="Allow OTP login" value={form.allowOtp} onChange={update("allowOtp")} />
          </div>
        </Card>
      </div>
    </div>
  );
}