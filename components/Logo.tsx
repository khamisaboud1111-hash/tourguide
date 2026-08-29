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
const HEIGHTS = { md: 44, sm: 36 };

export default function Logo({ className = "", href = "/", size = "md" }: Props) {
  const h = HEIGHTS[size] ?? HEIGHTS.md;
  const w = Math.round((h * 1536) / 1024);

  return (
    <Link
      href={href ?? "/"}
      aria-label={`${business.name} — home`}
      className={`inline-flex items-center shrink-0 ${className}`}
    >
      <Image
        src="/sitmeir-logo-md.png"
        alt={business.name}
        width={w}
        height={h}
        priority
        style={{ height: "auto", width: "auto" }}
        className="h-auto w-auto"
      />
    </Link>
  );
}
