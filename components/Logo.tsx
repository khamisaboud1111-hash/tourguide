import Link from "next/link";
import { business } from "@/lib/constants";

type Props = {
  variant?: "dark" | "light" | "auto";
  className?: string;
  href?: string | null;
  size?: "sm" | "md";
};

// Hand-drawn Zanzibar mark: sun + horizon + dhow
function Mark({ variant = "dark" }: { variant: "dark" | "light" }) {
  const isLight = variant === "light";
  // Colors adapt to header bg
  const sun = isLight ? "#F3D68C" : "#C08A2E"; // saffron 200 / 500
  const sunRay = isLight ? "rgba(255,255,255,0.55)" : "rgba(192,138,46,0.35)";
  const hull = isLight ? "#FBF8F1" : "#142825"; // ivory vs deep ocean
  const sail = isLight ? "#FBF8F1" : "#8B3A2B"; // ivory sail on dark, clove sail on light
  const sea = isLight ? "rgba(251,248,241,0.85)" : "rgba(20,40,37,0.85)";
  const stroke = isLight ? "rgba(251,248,241,0.9)" : "rgba(20,40,37,0.15)";

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Sun */}
      <circle cx="24.5" cy="9.5" r="6.2" fill={sun} />
      {/* Sun rays — subtle */}
      <g stroke={sunRay} strokeWidth="1" strokeLinecap="round" opacity={0.9}>
        <path d="M24.5 1.2V2.8M24.5 16.2V17.8M16.8 9.5H18.4M30.6 9.5H32.2M18.9 3.9L20 5M29 14L30.1 15.1M29 4.9L30.1 3.8M18.9 15.1L20 14" />
      </g>
      {/* Horizon + sea */}
      <path d="M3 25.5C7 23.2 12 22 18 22C24 22 29 23.2 33 25.5" stroke={sea} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3 27.2C7 25.4 12 24.4 18 24.4C24 24.4 29 25.4 33 27.2" stroke={sea} strokeWidth="1" strokeLinecap="round" opacity={0.6} />
      {/* Beach curve */}
      <path d="M3 29.5C9 27.8 15 27 21 27C26 27 30 27.8 33 29.5L33 32.5H3Z" fill={isLight ? "rgba(251,248,241,0.18)" : "rgba(20,40,37,0.06)"} stroke={stroke} strokeWidth="0.8" />
      {/* Dhow hull */}
      <path d="M9.5 26.8L10.5 28.6H26.2L27.2 26.8H9.5Z" fill={hull} stroke={isLight ? "rgba(255,255,255,0.8)" : "rgba(20,40,37,0.9)"} strokeWidth="0.7" strokeLinejoin="round" />
      {/* Mast */}
      <path d="M18.6 11.2V26.8" stroke={hull} strokeWidth="1.1" strokeLinecap="round" />
      {/* Sail — main */}
      <path d="M18.8 12L27.2 20.2L18.8 20.2Z" fill={sail} stroke={isLight ? "rgba(255,255,255,0.7)" : "rgba(139,58,43,0.9)"} strokeWidth="0.6" strokeLinejoin="round" />
      {/* Small foresail */}
      <path d="M18.2 14.5L13.2 20.2H18.2Z" fill={isLight ? "rgba(251,248,241,0.72)" : "white"} stroke={isLight ? "rgba(255,255,255,0.55)" : "rgba(20,40,37,0.12)"} strokeWidth="0.5" strokeLinejoin="round" opacity={isLight ? 1 : 0.95} />
      {/* Tiny flag at mast top */}
      <path d="M18.6 11.2L21 12.2L18.6 13.1Z" fill={isLight ? "#F3D68C" : "#C08A2E"} />
    </svg>
  );
}

export default function Logo({ variant = "dark", className = "", href = "/", size = "md" }: Props) {
  const isLight = variant === "light";
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`inline-flex items-center justify-center rounded-xl shrink-0 ${isLight ? "bg-white/10 backdrop-blur border border-white/15" : "bg-white border border-stone-200 shadow-soft"} ${size === "sm" ? "h-9 w-9" : "h-9 w-9 md:h-10 md:w-10"}`}>
        <Mark variant={isLight ? "light" : "dark"} />
      </span>
      <span className="leading-none text-left">
        <span className={`block font-display italic font-semibold tracking-tight leading-none ${size === "sm" ? "text-[1.05rem]" : "text-[1.15rem] md:text-[1.35rem]"} ${isLight ? "text-white" : "text-stone-900"}`}>
          Sitmeir
        </span>
        <span className={`block font-body uppercase tracking-[0.14em] font-medium leading-none mt-0.5 ${size === "sm" ? "text-[0.62rem]" : "text-[0.66rem] md:text-[0.70rem]"} ${isLight ? "text-stone-100/85" : "text-stone-600"}`}>
          Tours and Travel
        </span>
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href!} aria-label={`${business.name} — home`} className="inline-flex">
      {content}
    </Link>
  );
}
