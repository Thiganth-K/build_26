"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeadlinePanelProps {
  events: any[];
}

export function DeadlinePanel({ events = [] }: DeadlinePanelProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-soft flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Bootcamp Deadlines & Schedule
          </h3>
        </div>
        <Link
          href="/admin/schedule"
          className="text-[11px] text-accent font-semibold hover:underline flex items-center gap-0.5"
        >
          <span>Full Schedule</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-secondary">
            No schedule events found.
          </div>
        ) : (
          events.slice(0, 6).map((ev) => (
            <div
              key={ev._id}
              className="p-3 rounded-lg border border-border/80 bg-surface-subtle/40 hover:bg-surface-subtle transition-colors flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={ev.type === "Submission" ? "danger" : "secondary"}>
                    {ev.type}
                  </Badge>
                  <span className="text-[11px] font-mono-num font-semibold text-secondary">
                    Day {ev.day} • {ev.startTime}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#111111] mt-1.5">{ev.title}</div>
                <div className="text-[11px] text-secondary mt-0.5 line-clamp-1">
                  {ev.location}
                </div>
              </div>

              {ev.isCompleted ? (
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Done</span>
                </div>
              ) : (
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono-num font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
