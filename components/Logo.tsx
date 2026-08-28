import Link from "next/link";
import Image from "next/image";
import { business } from "@/lib/constants";

type Props = {
  variant?: "dark" | "light" | "auto";
  className?: string;
  href?: string | null;
  size?: "sm" | "md";
};

// Official Sitmeir Tours & Travel logo (sitmeir-logo.png)
// Transparent PNG, source aspect 1536x1024 (~3:2). Sized by height.
// `light` variant sits on a transparent navbar over a dark hero, so the
// logo gets a soft light pill to guarantee legibility regardless of its colors.
const HEIGHTS = { md: 44, sm: 36 };

export default function Logo({ variant = "dark", className = "", href = "/", size = "md" }: Props) {
  const isLight = variant === "light";
  const h = HEIGHTS[size] ?? HEIGHTS.md;
  const w = Math.round((h * 1536) / 1024);

  const img = (
    <Image
      src="/sitmeir-logo-md.png"
      alt={business.name}
      width={w}
      height={h}
      priority
      style={{ height: "auto", width: "auto" }}
      className="h-auto w-auto"
    />
  );

  return (
    <Link
      href={href ?? "/"}
      aria-label={`${business.name} — home`}
      className={`inline-flex items-center shrink-0 ${className}`}
    >
      {isLight ? (
        <span className="inline-flex items-center rounded-full bg-white/12 backdrop-blur-md border border-white/25 px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
          {img}
        </span>
      ) : (
        img
      )}
    </Link>
  );
}
