import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  icon?: LucideIcon;
  color?: "default" | "accent" | "emerald" | "amber" | "rose";
  subtext?: string;
}

export function KpiCard({
  label,
  value,
  trend,
  trendPositive = true,
  icon: Icon,
  color = "default",
  subtext,
}: KpiCardProps) {
  const colorStyles = {
    default: "text-[#111111]",
    accent: "text-accent",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-soft transition-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-secondary">{label}</span>
        {Icon && (
          <div className="rounded-lg bg-surface-subtle p-1.5 border border-border/60">
            <Icon className="h-3.5 w-3.5 text-secondary" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className={cn("text-2xl font-bold font-mono-num tracking-tight", colorStyles[color])}>
          {value}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {trend && (
            <span
              className={cn(
                "text-[11px] font-medium font-mono-num",
                trendPositive ? "text-emerald-600" : "text-amber-600"
              )}
            >
              {trend}
            </span>
          )}
          {subtext && <span className="text-[11px] text-secondary">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}
