type Props = {
  className?: string;
  tone?: "onLight" | "onDark";
};

// A repeating rosette-and-stud motif, referencing the carved geometric
// borders and brass studs found on traditional Zanzibari doors. Used as
// the site's one recurring signature element â€” a section divider, not
// a page-wide decoration.
export default function DoorMotifDivider({ className = "", tone = "onLight" }: Props) {
  const stroke = tone === "onLight" ? "#8B3A2B" : "#F5EFDD"; // clove-500 / stone-100
  const stud = tone === "onLight" ? "#C08A2E" : "#F3D68C"; // saffron-500 / saffron-200
  const units = 16;
  const unitWidth = 60;
  const width = units * unitWidth;

  return (
    <svg
      viewBox={`0 0 ${width} 48`}
      preserveAspectRatio="none"
      className={`w-full h-10 md:h-12 ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <line x1={0} y1={24} x2={width} y2={24} stroke={stroke} strokeWidth={1} opacity={0.5} />
      {Array.from({ length: units }).map((_, i) => {
        const cx = i * unitWidth + unitWidth / 2;
        return (
          <g key={i}>
            <rect
              x={cx - 9}
              y={15}
              width={18}
              height={18}
              stroke={stroke}
              strokeWidth={1.5}
              fill="none"
              transform={`rotate(45 ${cx} 24)`}
            />
            <circle cx={cx} cy={24} r={2.5} fill={stud} />
            <circle cx={cx - unitWidth / 2} cy={24} r={1.5} fill={stroke} opacity={0.6} />
          </g>
        );
      })}
    </svg>
  );
}
