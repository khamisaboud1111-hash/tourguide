import { cn } from "@/lib/tokens";
import * as React from "react";

/**
 * Uiverse "Floating Label" input — the label sits inside the field and floats
 * up into a chip above the border on focus or once the field has a value.
 * Pure CSS state handling (peer styles) — no JS required to float.
 */
export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, id, className, required, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || `floating-${generatedId}`;
  return (
    <div className={cn("relative", className)}>
      <input
        id={inputId}
        ref={ref}
        required={required}
        placeholder=" "
        className="peer h-12 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 pt-4 text-sm text-stone-900 outline-none transition-colors duration-ui ease-ui focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 disabled:opacity-60 disabled:cursor-not-allowed"
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-3 top-3.5 px-1 text-sm text-stone-500 transition-all duration-ui ease-ui peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-focus:top-[-9px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-clove-600 peer-focus:bg-white peer-focus:rounded peer-[:not(:placeholder-shown)]:top-[-9px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-stone-600 peer-[:not(:placeholder-shown)]:bg-white"
      >
        {label}
        {required && <span className="text-clove-600 ml-0.5">*</span>}
      </label>
    </div>
  );
});
FloatingInput.displayName = "FloatingInput";
