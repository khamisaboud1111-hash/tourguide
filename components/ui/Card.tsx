import { cn } from "@/lib/tokens";

export function Card({
  children,
  className,
  hover = false,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-stone-200 overflow-hidden",
        "shadow-soft",
        hover && "hover:shadow-card-hover hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-emphasis ease-entrance",
        padding && "p-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 md:p-6", className)}>{children}</div>;
}

export function CardImageWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative overflow-hidden", className)}>{children}</div>;
}
