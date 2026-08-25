// Layered hills silhouette backdrop — same visual idea as premium travel sites,
// but self-hosted SVG in brand palette (no external CDN, no licensing risk).
export default function HillsBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      {/* far hills — softest */}
      <path
        d="M0 220 C 180 150 340 130 520 170 C 700 210 820 150 1000 140 C 1180 130 1320 170 1440 200 L 1440 320 L 0 320 Z"
        fill="#1D3934"
        opacity="0.35"
      />
      {/* mid hills */}
      <path
        d="M0 260 C 160 200 320 190 480 220 C 660 255 800 200 980 190 C 1160 180 1320 220 1440 250 L 1440 320 L 0 320 Z"
        fill="#142825"
        opacity="0.55"
      />
      {/* near hills — deepest */}
      <path
        d="M0 300 C 200 250 400 245 600 270 C 820 297 1000 255 1200 250 C 1320 247 1400 265 1440 280 L 1440 320 L 0 320 Z"
        fill="#0F1F1C"
        opacity="0.85"
      />
    </svg>
  );
}
