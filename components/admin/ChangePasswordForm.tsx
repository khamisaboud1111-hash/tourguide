"use client";

import { useState, useTransition } from "react";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { changePassword } from "@/app/actions/auth";

const input = "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await changePassword(fd);
      if (res.ok) {
        setDone(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="newPassword">New password</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} className={input} placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className={input} placeholder="Repeat it" />
      </div>

      {error && <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-3 py-2">{error}</p>}
      {done && (
        <p className="rounded-lg bg-lagoon-50 text-lagoon-700 text-sm px-3 py-2 inline-flex items-center gap-2">
          <CheckCircle2 size={15} /> Password changed. Use it next time you sign in.
        </p>
      )}

      <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-full bg-clove-600 text-white px-6 py-3 text-sm font-medium hover:bg-clove-700 disabled:opacity-60 transition-colors shadow-soft">
        <KeyRound size={15} /> {isPending ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}
