import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Zanzibar palette — restrained, editorial, premium ──────────
        // Deep Ocean ~ #0B2927 (indigo/lagoon 900 range), Warm Ivory ~ #F7F3EA (stone.50),
        // Clove ~ #8B3A2B (clove.500), Brass ~ #C08A2E (saffron.500)
        stone: {
          50: "#FBF8F1", 100: "#F5EFDD", 200: "#EDE3C8", 300: "#E0D2AC",
          400: "#C9B583", 500: "#AD9563", 600: "#8C7548", 700: "#6B5A38",
          800: "#4A3E29", 900: "#2A211C",
        },
        lagoon: {
          50: "#EEF6F3", 100: "#D3E8E1", 200: "#A8D1C4", 300: "#7CB9A8",
          400: "#5A9F8D", 500: "#3E7E6E", 600: "#316356", 700: "#274D43",
          800: "#1D3934", 900: "#142825",
        },
        clove: {
          50: "#FBEEEA", 100: "#F0D2C7", 200: "#DFA790", 300: "#C87A5C",
          400: "#A85539", 500: "#8B3A2B", 600: "#712E22", 700: "#58241B",
          800: "#401A13", 900: "#2A110C",
        },
        saffron: {
          50: "#FDF7E9", 100: "#FAEBC3", 200: "#F3D68C", 300: "#E9BD5E",
          400: "#D9A63F", 500: "#C08A2E", 600: "#9C6E22", 700: "#78551C",
          800: "#543C15", 900: "#33240D",
        },
        indigo: {
          50: "#EAF0F4", 100: "#C4D6E0", 200: "#93B2C4", 300: "#628EA8",
          400: "#3D6885", 500: "#274A63", 600: "#1C3448", 700: "#16283A",
          800: "#101D2A", 900: "#0A131C",
        },
        // Semantic aliases — use these for intent, not raw scale
        surface: {
          DEFAULT: "#FBF8F1", // stone.50 — warm ivory canvas
          muted: "#F5EFDD",   // stone.100
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1A241F", // near lagoon.900 / stone.900 blend
          muted: "#4A3E29",   // stone.800
          faint: "#6B5A38",   // stone.700
        },
        border: {
          DEFAULT: "#EDE3C8", // stone.200
          strong: "#E0D2AC",  // stone.300
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-work-sans)"],
      },
      // ── Type scale — editorial serif for emotion, sans for UI ───────
      fontSize: {
        // Fraunces — display & headings
        display: ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "500" }],
        h1: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "600" }],
        h2: ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        // Work Sans — body & UI
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.8125rem", { lineHeight: "1.5" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "500" }],
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      // ── Radii — restrained, not everything is a pill ────────────────
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
      },
      // ── Shadows — subtle, cinematic, never heavy ─────────────────────
      boxShadow: {
        soft: "0 1px 2px rgba(10, 19, 28, 0.06), 0 4px 12px rgba(10, 19, 28, 0.05)",
        card: "0 1px 3px rgba(10, 19, 28, 0.07), 0 8px 24px rgba(10, 19, 28, 0.06)",
        "card-hover": "0 4px 12px rgba(10, 19, 28, 0.09), 0 16px 32px rgba(10, 19, 28, 0.07)",
        nav: "0 1px 0 rgba(10, 19, 28, 0.06), 0 12px 32px rgba(10, 19, 28, 0.08)",
        floating: "0 8px 24px rgba(10, 19, 28, 0.12), 0 20px 48px rgba(10, 19, 28, 0.10)",
      },
      // ── Transitions — fast, purposeful ───────────────────────────────
      transitionDuration: {
        micro: "150ms",
        ui: "200ms",
        emphasis: "280ms",
        enter: "320ms",
      },
      transitionTimingFunction: {
        ui: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      // ── Breakpoints — keep defaults + add editorial xs ───────────────
      screens: {
        xs: "390px",
      },
      // ── Container scale ──────────────────────────────────────────────
      maxWidth: {
        prose: "68ch",
        content: "72rem", // 1152 — 6xl
        wide: "80rem",    // 1280 — 7xl for hero/gallery
      },
      // ── Spacing accent — hero & section rhythm ───────────────────────
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
      // ── Keyframes — only subtle reveals (honor reduced-motion) ──────
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        reveal: "reveal 480ms var(--ease-entrance) both",
        "fade-in": "fade-in 220ms var(--ease-ui) both",
        "scale-in": "scale-in 260ms var(--ease-entrance) both",
      },
    },
  },
  plugins: [],
};
export default config;
