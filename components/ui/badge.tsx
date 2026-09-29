import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "secondary" | "accent" | "outline";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium transition-colors select-none";

  const variantStyles = {
    default: "bg-[#111111] text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/80",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/80",
    secondary: "bg-[#F1F1EF] text-[#4A4A4A] border border-border/70",
    accent: "bg-accent/10 text-accent border border-accent/20",
    outline: "bg-transparent text-secondary border border-border",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] rounded-md gap-1",
    md: "px-2.5 py-1 text-xs rounded-md gap-1.5",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
