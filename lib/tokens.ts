// Design tokens — TypeScript mirror of tailwind.config.ts + globals.css vars.
// Import from here when you need token values in JS (animations, canvas, maps, emails).

export const tokens = {
  color: {
    canvas: "#FBF8F1",
    surfaceMuted: "#F5EFDD",
    card: "#FFFFFF",
    ink: "#1A241F",
    inkMuted: "#4A3E29",
    inkFaint: "#6B5A38",
    border: "#EDE3C8",
    borderStrong: "#E0D2AC",
    ocean: "#142825",
    clove: "#8B3A2B",
    cloveHover: "#712E22",
    brass: "#C08A2E",
    // Full ramps are in tailwind.config.ts — these are the semantic anchors
  },
  radius: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "28px",
    full: "9999px",
  },
  shadow: {
    soft: "0 1px 2px rgba(10, 19, 28, 0.06), 0 4px 12px rgba(10, 19, 28, 0.05)",
    card: "0 1px 3px rgba(10, 19, 28, 0.07), 0 8px 24px rgba(10, 19, 28, 0.06)",
    cardHover: "0 4px 12px rgba(10, 19, 28, 0.09), 0 16px 32px rgba(10, 19, 28, 0.07)",
    nav: "0 1px 0 rgba(10, 19, 28, 0.06), 0 12px 32px rgba(10, 19, 28, 0.08)",
    floating: "0 8px 24px rgba(10, 19, 28, 0.12), 0 20px 48px rgba(10, 19, 28, 0.10)",
  },
  duration: {
    micro: "150ms",
    ui: "200ms",
    emphasis: "280ms",
    enter: "320ms",
  },
  ease: {
    ui: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  container: {
    content: "72rem",
    wide: "80rem",
    prose: "68ch",
  },
  typeScale: {
    display: "4.5rem",
    h1: "3rem",
    h2: "2.25rem",
    h3: "1.5rem",
    h4: "1.125rem",
    bodyLg: "1.125rem",
    body: "1rem",
    bodySm: "0.875rem",
    caption: "0.8125rem",
    label: "0.75rem",
    micro: "0.6875rem",
  },
} as const;

// Tiny classname merger — avoids adding clsx/tailwind-merge for Phase 1.
// When usage grows, swap to `clsx` + `twMerge` without changing call sites.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export type Tokens = typeof tokens;
