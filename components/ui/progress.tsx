import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: "accent" | "emerald" | "amber" | "rose";
}

export function ProgressBar({ value, color = "accent", className, ...props }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorClasses = {
    accent: "bg-accent",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-subtle border border-border/50", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out rounded-full", colorClasses[color])}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EDEDED"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#5E56E7"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute font-mono-num text-[11px] font-bold text-[#111111]">{Math.round(value)}%</span>
    </div>
  );
}
