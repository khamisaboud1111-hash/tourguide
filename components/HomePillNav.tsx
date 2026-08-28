"use client";

import PillNav from "@/components/react-bits/PillNav/PillNav";

const items = [
  { href: "#why-local", label: "Why local" },
  { href: "#signature", label: "Experiences" },
  { href: "#destinations", label: "Destinations" },
  { href: "#meet-guide", label: "Guide" },
  { href: "/gallery", label: "Gallery" },
];

/**
 * React Bits PillNav — animated pill navigation. Shown as a floating
 * section-jump bar docked over the homepage hero. Themed to the dark
 * hero (white pill bar, deep-ink hover).
 */
export default function HomePillNav() {
  return (
    <div className="pointer-events-none">
      <div className="pointer-events-auto">
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