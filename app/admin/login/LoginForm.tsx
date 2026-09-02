"use client";

import { useState, useTransition } from "react";
import { signIn } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotPending, setForgotPending] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (!result.ok) {
        setError(result.error || "Unable to sign in.");
        return;
      }
      window.location.assign("/admin");
    });
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotMsg(null);
    const raw = forgotEmail.trim();
    if (!raw) {
      setForgotMsg("Enter your email or phone first.");
      return;
    }
    setForgotPending(true);
    try {
      const supabase = createClient();
      const isEmail = raw.includes("@");
      if (isEmail) {
        const { error } = await supabase.auth.resetPasswordForEmail(raw, {
          redirectTo: `${window.location.origin}/admin/login?reset=1`,
        });
        if (error) setForgotMsg(error.message);
        else setForgotMsg("Check your email — reset link sent if that address exists.");
      } else {
        // Phone OTP — Supabase will send SMS if phone auth is configured
        const { error } = await supabase.auth.signInWithOtp({ phone: raw });
        if (error) setForgotMsg(error.message);
        else setForgotMsg("Check your phone — OTP sent if that number exists. Enter it on the login screen.");
      }
    } catch (err: unknown) {
      setForgotMsg(err instanceof Error ? err.message : "Could not send reset code.");
    } finally {
      setForgotPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-lagoon-600 hover:bg-lagoon-700 transition-colors text-stone-50 px-6 py-3 font-medium disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowForgot((v) => !v)}
          className="text-sm text-clove-700 hover:text-clove-800 hover:underline"
        >
          Forgot password?
        </button>
      </div>
      {showForgot && (
        <form onSubmit={handleForgot} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
          <p className="text-sm font-medium text-stone-700">Reset password</p>
          <p className="text-xs text-stone-500">Enter your admin email or phone — we&apos;ll send a reset link or OTP.</p>
          <input
            type="text"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="admin@example.com or +255 700 000 000"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-clove-500"
            required
          />
          <button
            type="submit"
            disabled={forgotPending}
            className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-2.5 text-sm font-medium hover:bg-stone-800 disabled:opacity-60"
          >
            {forgotPending ? "Sending…" : "Send reset link / OTP"}
          </button>
          {forgotMsg && (
            <p className={`text-sm px-3 py-2 rounded-lg ${forgotMsg.includes("Check") ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>
              {forgotMsg}
            </p>
          )}
        </form>
      )}
    </form>
  );
}
