import { cn } from "@/lib/tokens";

type BadgeVariant = "category" | "muted" | "success" | "warning" | "inverse";

const variants: Record<BadgeVariant, string> = {
  category: "bg-stone-50/90 text-clove-700 backdrop-blur border border-stone-200/60",
  muted: "bg-stone-100 text-stone-700 border border-stone-200",
  success: "bg-lagoon-50 text-lagoon-700 border border-lagoon-200",
  warning: "bg-saffron-50 text-saffron-700 border border-saffron-200",
  inverse: "bg-indigo-700 text-stone-100 border border-indigo-600",
};

export default function Badge({
  children,
  variant = "category",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
