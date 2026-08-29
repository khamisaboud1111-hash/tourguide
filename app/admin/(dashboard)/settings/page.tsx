import { createClient } from "@/lib/supabase/server";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { getLang, tServer } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("email, full_name, role").eq("id", user.id).single()
    : { data: null };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminSettingsTitle", lang)}</h1>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 mb-6 max-w-md">
        <h2 className="font-display font-semibold text-sm mb-2">{tServer("adminSettingsSignedInAs", lang)}</h2>
        <p className="text-sm text-stone-700">{profile?.email ?? user?.email}</p>
        <p className="text-xs text-stone-500 mt-1">
          {tServer("adminSettingsRoleLabel", lang)} <span className="font-medium capitalize">{profile?.role ?? "—"}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 max-w-md">
        <h2 className="font-display font-semibold text-sm mb-4">{tServer("adminSettingsChangePassword", lang)}</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
