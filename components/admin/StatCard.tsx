"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  href?: string;
  color?: "clove" | "lagoon" | "saffron" | "stone";
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  href,
  color = "clove",
}: StatCardProps) {
  const colorClasses = {
    clove: "text-clove-600 bg-clove-50 border-clove-100",
    lagoon: "text-lagoon-600 bg-lagoon-50 border-lagoon-100",
    saffron: "text-saffron-600 bg-saffron-50 border-saffron-100",
    stone: "text-stone-600 bg-stone-100 border-stone-200",
  };

  const content = (
    <div className={`rounded-2xl border p-6 transition-colors hover:border-clove-300 ${href ? "cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">{label}</p>
          <p className="mt-2 text-3xl font-display font-semibold text-stone-900">{value}</p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-sm">
              <span className={`font-medium ${trend.value >= 0 ? "text-lagoon-600" : "text-clove-600"}`}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-stone-500">{trend.label}</span>
            </p>
          )}
        </div>
        {icon && <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}