"use client";

import PillNav from "@/components/react-bits/PillNav/PillNav";

const items = [
  { href: "#discover", label: "Why local" },
  { href: "#signature", label: "Experiences" },
  { href: "#destinations", label: "Destinations" },
  { href: "#guide", label: "Guide" },
  { href: "#jump-gallery", label: "Gallery" },
];

/**
 * React Bits PillNav — animated pill navigation. Shown as a floating
 * section-jump bar docked over the homepage hero. Themed to the dark
 * hero (white pill bar, deep-ink hover).
 */
export default function HomePillNav() {
  return (
    <div className="hidden md:block pointer-events-none">
      <div className="pointer-events-auto" style={{ marginTop: "6.25rem" }}>
        <PillNav
          logoText="Sitmeir"
          items={items}
          activeHref=""
          baseColor="#fff"
          pillColor="#120F17"
          hoveredPillTextColor="#fff"
        />
      </div>
    </div>
  );
}