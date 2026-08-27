"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: "clove" | "lagoon" | "saffron" | "stone" | "emerald" | "violet";
  href?: string;
}

const colorClasses = {
  clove: "text-clove-600 bg-clove-50 border-clove-100",
  lagoon: "text-lagoon-600 bg-lagoon-50 border-lagoon-100",
  saffron: "text-saffron-600 bg-saffron-50 border-saffron-100",
  stone: "text-stone-600 bg-stone-100 border-stone-200",
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  violet: "text-violet-600 bg-violet-50 border-violet-100",
};

export function MetricCard({ title, value, change, changeLabel, icon, color = "clove", href }: MetricCardProps) {
  const content = (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 transition-colors hover:border-clove-300 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-500 truncate">{title}</p>
          <p className="mt-2 text-3xl font-display font-semibold text-stone-900">{value}</p>
          {change !== undefined && changeLabel && (
            <p className="mt-2 flex items-center gap-1 text-sm">
              {change > 0 && <TrendingUp size={14} className="text-lagoon-600" />}
              {change < 0 && <TrendingDown size={14} className="text-clove-600" />}
              {change === 0 && <Minus size={14} className="text-stone-400" />}
              <span className={`font-medium ${change > 0 ? "text-lagoon-600" : change < 0 ? "text-clove-600" : "text-stone-500"}`}>
                {change > 0 ? "+" : ""}{change}%
              </span>
              <span className="text-stone-500">{changeLabel}</span>
            </p>
          )}
        </div>
        {icon && <div className={`p-3 rounded-xl ${({ clove: "text-clove-600 bg-clove-50 border-clove-100", lagoon: "text-lagoon-600 bg-lagoon-50 border-lagoon-100", saffron: "text-saffron-600 bg-saffron-50 border-saffron-100", stone: "text-stone-600 bg-stone-100 border-stone-200", emerald: "text-emerald-600 bg-emerald-50 border-emerald-100", violet: "text-violet-600 bg-violet-50 border-violet-100" } as Record<string, string>)[color]}`}>{icon}</div>}
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }
  return content;
}

interface ChartProps {
  data: { label: string; value: number }[];
  color?: "clove" | "lagoon" | "saffron" | "emerald";
  height?: number;
}

export function AreaChart({ data, color = "clove", height = 200 }: ChartProps) {
  if (!data.length) return <div className="h-full flex items-center justify-center text-stone-400">No data</div>;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const colorClasses = {
    clove: "stroke-clove-500",
    lagoon: "stroke-lagoon-500",
    saffron: "stroke-saffron-500",
    emerald: "stroke-emerald-500",
  };

  const fillClasses = {
    clove: "fill-clove-500/10",
    lagoon: "fill-lagoon-500/10",
    saffron: "fill-saffron-500/10",
    emerald: "fill-emerald-500/10",
  };

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 90;
    return `${x}%,${y}%`;
  }).join(" ");

  const areaPoints = [
    `${0}%,100%`,
    ...points.split(" "),
    `${100}%,100%`,
  ].join(" ");

  return (
    <div className="w-full h-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={({ clove: "#8B3A2B", lagoon: "#142825", saffron: "#C08A2E", emerald: "#10B981" } as Record<string, string>)[color]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={({ clove: "#8B3A2B", lagoon: "#142825", saffron: "#C08A2E", emerald: "#10B981" } as Record<string, string>)[color]} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} className={fillClasses[color]} />
        <polyline points={points} fill="none" strokeWidth="1.5" className={`${colorClasses[color]} stroke-linecap-round stroke-linejoin-round`} />
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 90;
          return (
            <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" className={`fill-white stroke-2 ${({ clove: "stroke-clove-500", lagoon: "stroke-lagoon-500", saffron: "stroke-saffron-500", emerald: "stroke-emerald-500" } as Record<string, string>)[color]}`} />
          );
        })}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: "clove" | "lagoon" | "saffron" | "emerald";
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, color = "clove", height = 200, horizontal = false }: BarChartProps) {
  if (!data.length) return <div className="h-full flex items-center justify-center text-stone-400">No data</div>;

  const maxValue = Math.max(...data.map((d) => d.value));
  const colorClasses = {
    clove: "bg-clove-500",
    lagoon: "bg-lagoon-500",
    saffron: "bg-saffron-500",
    emerald: "bg-emerald-500",
  };

  if (horizontal) {
    return (
      <div className="h-full" style={{ height }}>
        <div className="flex items-end justify-between h-full gap-2 px-2">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-full bg-stone-100 rounded-t relative" style={{ height: "80%" }}>
                <div
                  className={`${colorClasses[color]} rounded-t transition-all duration-500`}
                  style={{ height: `${(d.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="mt-2 text-xs text-center text-stone-600 truncate w-16">{d.label}</span>
              <span className="text-xs font-medium text-stone-900">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-2">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 min-w-0">
            <div className="w-full bg-stone-100 rounded-t relative" style={{ height: "80%" }}>
              <div
                className={`${colorClasses[color]} rounded-t transition-all duration-500`}
                style={{ height: `${(d.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="mt-2 text-xs text-center text-stone-600 truncate w-16">{d.label}</span>
            <span className="text-xs font-medium text-stone-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  if (!data.length) return <div className="h-full flex items-center justify-center text-stone-400">No data</div>;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const circumference = 2 * Math.PI * 60;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {data.map((d, i) => {
            const prevSum = data.slice(0, i).reduce((sum, d) => sum + d.value, 0);
            const offset = (prevSum / total) * circumference;
            const stroke = (d.value / total) * circumference;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={60}
                fill="none"
                stroke={d.color}
                strokeWidth={20}
                strokeDasharray={`${stroke} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transform -rotate-90"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-stone-900">{total}</p>
            <p className="text-xs text-stone-500">Total</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-stone-700">{d.label}</span>
            <span className="text-sm font-medium text-stone-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}