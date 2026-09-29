"use client";

import * as React from "react";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress";

interface PhaseTimelineProps {
  currentPhase: string;
  overallProgress: number;
  teamsCompletedCount?: number;
  teamsPendingCount?: number;
  onPhaseSelect?: (phase: string) => void;
}

const PHASES = [
  { id: "Problem Understanding", num: "01", label: "Problem Discovery", desc: "User research & scoping" },
  { id: "Ideation", num: "02", label: "Ideation", desc: "Solution decks & wireframes" },
  { id: "Validation", num: "03", label: "Validation", desc: "Mentor feedback & schema" },
  { id: "Build", num: "04", label: "Build", desc: "Frontend & backend sprints" },
  { id: "Testing", num: "05", label: "Testing", desc: "Stress test & prototype" },
  { id: "Final Demo", num: "06", label: "Final Demo", desc: "Live pitches & jury score" },
];

export function BootcampPhaseTimeline({
  currentPhase = "Ideation",
  overallProgress = 48,
  teamsCompletedCount = 4,
  teamsPendingCount = 6,
  onPhaseSelect,
}: PhaseTimelineProps) {
  const currentIdx = PHASES.findIndex((p) => p.id === currentPhase);
  const activeIdx = currentIdx !== -1 ? currentIdx : 1;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-soft">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Bootcamp Journey
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent/10 text-accent font-mono-num">
              Phase {activeIdx + 1} of 6: {PHASES[activeIdx].label}
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Tracking multi-stage progression from challenge discovery through to demo pitch showcase.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[11px] text-secondary">Overall Completion</div>
            <div className="text-lg font-bold font-mono-num text-[#111111]">{overallProgress}%</div>
          </div>
          <div className="h-8 w-px bg-border/80" />
          <div className="flex items-center gap-3 text-xs">
            <div>
              <span className="font-bold font-mono-num text-emerald-600">{teamsCompletedCount}</span>
              <span className="text-secondary ml-1">in build/demo</span>
            </div>
            <span className="text-border">•</span>
            <div>
              <span className="font-bold font-mono-num text-amber-600">{teamsPendingCount}</span>
              <span className="text-secondary ml-1">in ideation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Steps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4">
        {PHASES.map((phase, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isUpcoming = idx > activeIdx;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseSelect?.(phase.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between group",
                isCurrent
                  ? "border-accent bg-accent/[0.03] ring-1 ring-accent/30 shadow-xs"
                  : isDone
                  ? "border-border/80 bg-surface-subtle/50 hover:bg-surface-subtle"
                  : "border-border/50 bg-surface opacity-70 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-xs font-mono-num font-bold",
                    isCurrent ? "text-accent" : isDone ? "text-emerald-600" : "text-secondary"
                  )}
                >
                  {phase.num}
                </span>
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <Clock className="h-3.5 w-3.5 text-accent animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-border" />
                )}
              </div>

              <div>
                <div
                  className={cn(
                    "text-xs font-semibold tracking-tight",
                    isCurrent ? "text-accent" : "text-[#111111]"
                  )}
                >
                  {phase.label}
                </div>
                <div className="text-[10px] text-secondary mt-0.5 line-clamp-1">{phase.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <ProgressBar value={overallProgress} color="accent" className="h-1.5" />
      </div>
    </div>
  );
}
