"use client";

import { useState } from "react";
import { Bell, Check, Archive } from "lucide-react";
import { useLang } from "@/lib/i18n/context";

const initialNotifications: { id: number; type: string; titleKey: string; bodyKey: string; bodyParams: Record<string, string | number>; time: string; read: boolean }[] = [];

export default function AdminNotificationsPage() {
  const { t } = useLang();
  const [notifications, setNotifications] = useState(initialNotifications);

  const renderBody = (key: string, params: Record<string, string | number>) => {
    let s = t(key);
    for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, String(v));
    return s;
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminNotificationsTitle")}</h1>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-clove-600 hover:underline inline-flex items-center gap-1">
            <Check size={14} /> {t("adminNotificationsMarkAllRead")}
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Bell size={16} className="text-stone-400" />
            <span>{t("adminNotificationsUnread").replace("{count}", String(unread))}</span>
          </div>
        </div>
        <div className="divide-y divide-stone-100">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 hover:bg-stone-50 flex items-start gap-3 ${!n.read ? "bg-clove-50/40" : ""}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-clove-100 text-clove-600" : "bg-stone-100 text-stone-400"}`}>
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!n.read ? "font-medium" : ""} text-stone-800`}>{t(n.titleKey)}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-clove-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-stone-600 mt-0.5">{renderBody(n.bodyKey, n.bodyParams)}</p>
                <p className="text-xs text-stone-400 mt-1">{n.time}</p>
              </div>
              <button className="text-stone-300 hover:text-stone-500 transition-colors flex-shrink-0" aria-label={t("adminNotificationsArchiveAria")}>
                <Archive size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}