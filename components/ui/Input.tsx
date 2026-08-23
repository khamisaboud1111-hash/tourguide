import { cn } from "@/lib/tokens";
import * as React from "react";

const fieldBase =
  "w-full rounded-xl border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors duration-micro ease-ui focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 disabled:opacity-60 disabled:cursor-not-allowed";

const fieldInvalid = "border-clove-400 focus:border-clove-500 focus:ring-clove-500/20";
const fieldValid = "border-stone-300";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(fieldBase, invalid ? fieldInvalid : fieldValid, className)}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(fieldBase, "py-3 resize-y min-h-[88px]", invalid ? fieldInvalid : fieldValid, className)}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(fieldBase, "pr-9", invalid ? fieldInvalid : fieldValid, className)}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-stone-700 mb-1.5", className)} {...props} />;
}

export function FieldHint({ children, className, tone = "muted" }: { children: React.ReactNode; className?: string; tone?: "muted" | "error" }) {
  return (
    <p className={cn("mt-1.5 text-xs leading-relaxed", tone === "error" ? "text-clove-600" : "text-stone-500", className)}>
      {children}
    </p>
  );
}

export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}
