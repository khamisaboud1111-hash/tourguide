import { cn } from "@/lib/tokens";

type Align = "left" | "center";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
  titleAs = "h2",
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: Align;
  className?: string;
  titleAs?: "h2" | "h3";
}) {
  const TitleTag = titleAs;
  const isCenter = align === "center";
  return (
    <div className={cn(isCenter ? "text-center mx-auto max-w-2xl" : "max-w-2xl", className)}>
      {kicker && (
        <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">
          {kicker}
        </p>
      )}
      <TitleTag className="font-display text-h2 md:text-h2 font-semibold text-stone-900 text-balance">
        {title}
      </TitleTag>
      {description && (
        <p className={cn("mt-3 text-stone-600 leading-relaxed text-body", isCenter && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
