"use client";

import { useState } from "react";
import { Plus, User, Shield, Mail } from "lucide-react";
import { Button, Badge, Input } from "@/components/admin/AdminForms";

const roles = ["Administrator", "Manager", "Guide", "Staff", "Viewer"];

const initialMembers = [
  { id: 1, name: "Emma Johnson", email: "emma@aktivanz.com", role: "Administrator", active: true },
  { id: 2, name: "David Kimaro", email: "david@aktivanz.com", role: "Manager", active: true },
  { id: 3, name: "Grace Mwangi", email: "grace@aktivanz.com", role: "Guide", active: true },
  { id: 4, name: "Daniel Chuwa", email: "daniel@aktivanz.com", role: "Viewer", active: false },
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Team</h1>
        <Button icon={<Plus size={16} />}>Invite member</Button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-stone-50 border-b border-stone-200">
          {[
            { label: "Administrators", value: members.filter((m) => m.role === "Administrator").length },
            { label: "Guides", value: members.filter((m) => m.role === "Guide").length },
            { label: "Active members", value: members.filter((m) => m.active).length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border border-stone-200 p-4">
              <p className="text-2xl font-display font-semibold">{s.value}</p>
              <p className="text-xs text-stone-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {["Member", "Email", "Role", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-clove-100 flex items-center justify-center">
                      <User size={18} className="text-clove-600" />
                    </div>
                    <span className="text-sm font-medium text-stone-800">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  <span className="inline-flex items-center gap-1"><Mail size={14} className="text-stone-400" />{m.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-sm text-stone-600"><Shield size={14} className="text-stone-400" />{m.role}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={m.active ? "success" : "default"}>{m.active ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-clove-600 hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold mb-2">Roles &amp; permissions</h2>
        <p className="text-sm text-stone-500 mb-4">Manage what each team member can access and do.</p>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button key={r} className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:border-clove-300 hover:text-clove-700 transition-colors">
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}