import Link from "next/link";
import { cn } from "@/lib/tokens";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg" | "pill";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors transition-transform duration-ui ease-ui focus-ring disabled:opacity-60 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  // Clove â€” primary action, booking, CTAs
  primary:
    "bg-clove-600 text-stone-50 hover:bg-clove-700 active:bg-clove-800 shadow-soft hover:shadow-card",
  // Lagoon â€” secondary, WhatsApp-adjacent, calm
  secondary:
    "bg-lagoon-600 text-stone-50 hover:bg-lagoon-700 active:bg-lagoon-800 shadow-soft hover:shadow-card",
  // Light outline â€” over stone/indigo hero alternatives
  outline:
    "border border-stone-300 text-stone-800 hover:border-clove-300 hover:text-clove-700 hover:bg-clove-50/60 bg-stone-50",
  ghost:
    "text-stone-700 hover:text-clove-700 hover:bg-stone-100 bg-transparent border border-transparent",
  // Over dark / image â€” for hero overlays
  inverse:
    "bg-stone-50 text-stone-900 hover:bg-white border border-stone-200 shadow-card",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 rounded-full",
  md: "text-sm px-5 py-2.5 rounded-full",
  lg: "text-[0.9375rem] px-6 py-3.5 rounded-full",
  pill: "text-sm px-6 py-3 rounded-full",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props as ButtonProps & { children: React.ReactNode };
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...(anchorRest as object)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

// For places that already use <a> with external href and need button styling without Next Link:
export function AnchorButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
