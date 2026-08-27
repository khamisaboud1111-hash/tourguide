"use client";

import { ReactNode, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
            error
              ? "border-clove-300 bg-clove-50 focus:border-clove-500 focus:ring-clove-500/20"
              : "border-stone-300 bg-stone-50 focus:border-clove-500 focus:ring-clove-500/20"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-clove-600" role="alert">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-stone-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="w-full">
        {label && <label htmlFor={textareaId} className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors resize-y ${
            error
              ? "border-clove-300 bg-clove-50 focus:border-clove-500 focus:ring-clove-500/20"
              : "border-stone-300 bg-stone-50 focus:border-clove-500 focus:ring-clove-500/20"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-clove-600" role="alert">{error}</p>}
        {hint && !error && <p id={`${textareaId}-hint`} className="mt-1.5 text-xs text-stone-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = "", id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && <label htmlFor={selectId} className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors bg-white ${
            error
              ? "border-clove-300 bg-clove-50 focus:border-clove-500 focus:ring-clove-500/20"
              : "border-stone-300 bg-white focus:border-clove-500 focus:ring-clove-500/20"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p id={`${selectId}-error`} className="mt-1.5 text-sm text-clove-600" role="alert">{error}</p>}
        {hint && !error && <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-stone-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, iconPosition = "left", className = "", children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
      primary: "bg-clove-600 text-stone-50 hover:bg-clove-700 focus:ring-clove-500",
      secondary: "bg-lagoon-600 text-white hover:bg-lagoon-700 focus:ring-lagoon-500",
      outline: "border-2 border-clove-600 text-clove-600 hover:bg-clove-50 focus:ring-clove-500",
      ghost: "text-stone-600 hover:bg-stone-100 focus:ring-stone-500",
      danger: "bg-clove-600 text-white hover:bg-clove-700 focus:ring-clove-500",
    };
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin mr-2" />}
        {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-stone-100 text-stone-700",
    success: "bg-lagoon-100 text-lagoon-800",
    warning: "bg-saffron-100 text-saffron-800",
    danger: "bg-clove-100 text-clove-800",
    info: "bg-lagoon-100 text-lagoon-800",
  };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({ children, className = "", padding = "md", hover = false }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div className={`rounded-2xl border border-stone-200 bg-white ${paddingClasses[padding]} ${hover ? "hover:border-clove-300 hover:shadow-card-hover transition-all duration-200" : ""} ${className}`}>
      {children}
    </div>
  );
}