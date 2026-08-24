import Link from "next/link";
import { business } from "@/lib/constants";
import { Fraunces, Work_Sans, Cormorant_Garamond } from "next/font/google";

const frauncesLogo = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["italic"],
  display: "swap",
  variable: "--font-logo-fraunces",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"],
  display: "swap",
  variable: "--font-cormorant",
});

type Props = {
  variant?: "dark" | "light" | "auto";
  className?: string;
  href?: string | null;
  size?: "sm" | "md";
};

// Premium realistic mark: sun with glow + horizon + layered sea + beach + palm + detailed dhow
function Mark({ variant = "dark" }: { variant: "dark" | "light" }) {
  const isLight = variant === "light";

  // Palette â€” high contrast for clarity at 40px
  const sunFill = isLight ? "#FDE68A" : "#C08A2E"; // warm brass
  const sunGlow = isLight ? "rgba(253,230,138,0.35)" : "rgba(192,138,46,0.18)";
  const sailMain = isLight ? "#FFFBF0" : "#8B3A2B"; // ivory vs clove
  const sailShadow = isLight ? "rgba(255,255,255,0.9)" : "rgba(139,58,43,0.12)";
  const hullFill = isLight ? "#FFFBF0" : "#0F2A26"; // deep ocean for dark variant
  const hullStroke = isLight ? "rgba(255,255,255,0.95)" : "#142825";
  const sea1 = isLight ? "rgba(255,251,240,0.92)" : "#1A3D3A";
  const sea2 = isLight ? "rgba(255,251,240,0.55)" : "rgba(26,61,58,0.55)";
  const beachSand = isLight ? "rgba(255,251,240,0.22)" : "rgba(245,239,221,0.95)";
  const palm = isLight ? "rgba(255,255,255,0.9)" : "#0F2A26";

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Sun glow */}
      <circle cx="26.5" cy="10.5" r="9" fill={sunGlow} />
      {/* Sun */}
      <circle cx="26.5" cy="10.5" r="5.8" fill={sunFill} stroke={isLight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.9)"} strokeWidth="0.9" />
      {/* Sun rays â€” crisp, 8 directions */}
      <g stroke={isLight ? "rgba(255,255,255,0.75)" : "rgba(192,138,46,0.45)"} strokeWidth="1.1" strokeLinecap="round">
        <path d="M26.5 1.6V3.6M26.5 17.4V19.4M17.5 10.5H19.5M33.5 10.5H35.5M20.3 4.3L21.7 5.7M31.3 15.3L32.7 16.7M31.3 5.7L32.7 4.3M20.3 16.7L21.7 15.3" />
      </g>
      {/* Distant island silhouette */}
      <path d="M6 22.2C9 21.2 12.5 20.7 16.5 20.7C20.5 20.7 24 21.2 27 22.2L27 22.6H6V22.2Z" fill={isLight ? "rgba(255,255,255,0.18)" : "rgba(15,42,38,0.08)"} />
      {/* Sea â€” 3 layers for realism */}
      <path d="M2.5 25.6C7 23.6 12.5 22.6 18.5 22.6C24.5 22.6 30 23.6 37.5 25.6" stroke={sea1} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2.5 27.8C7 26.2 12.5 25.4 18.5 25.4C24.5 25.4 30 26.2 37.5 27.8" stroke={sea2} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M2.5 30C7 28.8 12.5 28.2 18.5 28.2C24.5 28.2 30 28.8 37.5 30" stroke={sea2} strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
      {/* Beach sand */}
      <path d="M2.5 31.2C9 29.6 14.5 28.8 20.5 28.8C27 28.8 32 29.6 37.5 31.2V34.5H2.5V31.2Z" fill={beachSand} stroke={isLight ? "rgba(255,255,255,0.45)" : "rgba(20,40,37,0.12)"} strokeWidth="0.7" />
      {/* Palm â€” small but clear */}
      <g stroke={palm} strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M32.2 31.2C32.2 29.8 32.6 28.6 33.2 27.8" />
        <path d="M33.2 27.8C32.4 27.4 31.6 27.2 30.8 27.2M33.2 27.8C34 27.4 34.8 27.2 35.6 27.2M33.2 27.8C33.2 27 32.9 26.2 32.4 25.6M33.2 27.8C33.2 27 33.5 26.2 34 25.6" strokeWidth="0.9" />
      </g>
      <circle cx="33.2" cy="27.8" r="0.9" fill={palm} />
      {/* Dhow hull â€” more realistic with chine */}
      <path d="M8.5 27.6L10.2 30.2H27.8L29.2 27.6H8.5Z" fill={hullFill} stroke={hullStroke} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M10.2 30.2L11 31.0H27L27.8 30.2" fill={isLight ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"} />
      {/* Mast */}
      <path d="M19.8 12.2V27.6" stroke={hullFill} strokeWidth="1.25" strokeLinecap="round" />
      {/* Main sail â€” realistic curved leech */}
      <path d="M19.9 13.2C22.4 15.4 25.6 17.8 28.4 20.4L19.9 20.4V13.2Z" fill={sailMain} stroke={isLight ? "rgba(255,255,255,0.95)" : "rgba(139,58,43,0.9)"} strokeWidth="0.7" strokeLinejoin="round" />
      {/* Sail fold line */}
      <path d="M19.9 16.8L24.2 20.4" stroke={sailShadow} strokeWidth="0.5" strokeLinecap="round" opacity="0.9" />
      {/* Foresail */}
      <path d="M19.2 15.6L12.4 20.4H19.2V15.6Z" fill={isLight ? "#FFFBF0" : "white"} stroke={isLight ? "rgba(255,255,255,0.7)" : "rgba(15,42,38,0.15)"} strokeWidth="0.55" strokeLinejoin="round" />
      {/* Pennant */}
      <path d="M19.8 12.2L22.4 13.3L19.8 14.4Z" fill={isLight ? "#FDE68A" : "#C08A2E"} stroke={isLight ? "rgba(255,255,255,0.6)" : "rgba(192,138,46,0.8)"} strokeWidth="0.4" />
      {/* Hull highlight */}
      <path d="M9.8 28.2H27.2" stroke={isLight ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"} strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ variant = "dark", className = "", href = "/", size = "md" }: Props) {
  const isLight = variant === "light";
  const isMd = size === "md";
  return (
    <Link
      href={href ?? "/"}
      aria-label={`${business.name} â€” home`}
      className={`inline-flex items-center gap-3 ${frauncesLogo.variable} ${cormorant.variable} ${className}`}
    >
      {/* Mark â€” larger, clearer, realistic */}
      <span
        className={`inline-flex items-center justify-center shrink-0 rounded-[12px] overflow-hidden relative ${
          isLight
            ? "bg-white/12 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
            : "bg-white border border-stone-200 shadow-[0_2px_10px_rgba(15,42,38,0.07),0_8px_24px_rgba(15,42,38,0.06)]"
        } ${isMd ? "h-[42px] w-[42px] md:h-[44px] md:w-[44px]" : "h-10 w-10"}`}
      >
        <Mark variant={isLight ? "light" : "dark"} />
        {/* subtle inner highlight */}
        <span className={`absolute inset-0 rounded-[12px] pointer-events-none ${isLight ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" : "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"}`} />
      </span>

      {/* Wordmark â€” far more beautiful */}
      <span className="leading-none text-left flex flex-col justify-center">
        <span
          className={`${cormorant.variable} font-[700] italic tracking-[-0.02em] leading-none ${isMd ? "text-[1.35rem] md:text-[1.55rem]" : "text-[1.2rem]"} ${isLight ? "text-white" : "text-stone-900"}`}
          style={{ fontFamily: "var(--font-cormorant), var(--font-logo-fraunces), Georgia, serif" }}
        >
          <span className="relative inline-block">
            Sitmeir
            <span className={`absolute -bottom-1 left-0 right-0 h-px ${isLight ? "bg-gradient-to-r from-white/0 via-white/40 to-white/0" : "bg-gradient-to-r from-transparent via-saffron-300/60 to-transparent"}`} />
          </span>
        </span>
        <span
          className={`font-body font-medium uppercase leading-none mt-1 flex items-center gap-1.5 ${isMd ? "text-[0.62rem] md:text-[0.68rem] tracking-[0.18em]" : "text-[0.6rem] tracking-[0.16em]"} ${isLight ? "text-stone-100/90" : "text-stone-500"}`}
        >
          <span className={`h-px w-4 ${isLight ? "bg-white/30" : "bg-stone-300"}`} />
          Tours and Travel
          <span className={`h-px w-4 ${isLight ? "bg-white/30" : "bg-stone-300"}`} />
        </span>

      </span>
    </Link>
  );
}
