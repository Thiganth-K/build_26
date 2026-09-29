"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Clock, ArrowRight, UserX, FileQuestion, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AttentionItem } from "@/types";

interface NeedsAttentionPanelProps {
  items: AttentionItem[];
}

export function NeedsAttentionPanel({ items = [] }: NeedsAttentionPanelProps) {
  const getItemIcon = (type: string) => {
    switch (type) {
      case "NO_ACTIVITY":
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      case "MISSING_SUBMISSION":
        return <FileQuestion className="h-3.5 w-3.5 text-rose-600" />;
      case "INCOMPLETE_TEAM":
        return <UserX className="h-3.5 w-3.5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50/20 p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Needs Immediate Attention
          </h3>
        </div>
        <Badge variant={items.length > 0 ? "warning" : "success"} className="font-mono-num text-[10px]">
          {items.length} Flagged {items.length === 1 ? "Item" : "Items"}
        </Badge>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-secondary flex flex-col items-center gap-1.5">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-[#111111]">All teams on track!</span>
            <span>No overdue submissions or unassigned mentors.</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-border/80 bg-surface flex items-center justify-between gap-3 shadow-xs hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 rounded-md p-1 bg-surface-subtle">{getItemIcon(item.type)}</div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <span>{item.teamName}</span>
                    <span className="text-[10px] text-secondary font-mono-num font-normal">
                      • {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5 truncate">{item.message}</p>
                </div>
              </div>

              <Link
                href={item.actionUrl}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
