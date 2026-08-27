"use client";

import { useState } from "react";
import { Activity } from "lucide-react";

const initialLogs = [
  { id: 1, user: "Emma Johnson", action: "Updated booking status to confirmed", target: "ZKT-1234ABCD", time: "10 min ago", type: "booking" },
  { id: 2, user: "Admin", action: "Created new tour: Sunset Dhow Cruise", target: "Tour", time: "32 min ago", type: "tour" },
  { id: 3, user: "Emma Johnson", action: "Exported CSV of payments", target: "Payments", time: "1 hour ago", type: "export" },
  { id: 4, user: "David Kimaro", action: "Changed business hours", target: "Settings", time: "2 hours ago", type: "settings" },
  { id: 5, user: "Admin", action: "Deleted review", target: "Review #42", time: "3 hours ago", type: "review" },
  { id: 6, user: "Grace Mwangi", action: "Linked WhatsApp integration", target: "WhatsApp", time: "5 hours ago", type: "integration" },
];

export default function AdminActivityPage() {
  const [logs] = useState(initialLogs);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Activity Log</h1>

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center gap-2 bg-stone-50">
          <Activity size={16} className="text-stone-400" />
          <span className="text-sm text-stone-500">Audit trail of admin actions</span>
        </div>
        <div className="divide-y divide-stone-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-stone-50 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-clove-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-clove-700">{log.user.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium text-stone-800">{log.user}</span>{" "}
                  <span className="text-stone-600">{log.action}</span>
                </p>
                <p className="text-xs text-stone-400 mt-0.5 font-mono">{log.target}</p>
              </div>
              <span className="text-xs text-stone-400 flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}