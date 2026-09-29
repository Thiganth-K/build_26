"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ParticipantSchedulePage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/schedule?day=1")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Today&apos;s Bootcamp Schedule
            </h1>
            <Badge variant="accent">Day 01 — Ideation</Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Real-time track of keynote briefings, team formation gates, and submission deadlines.
          </p>
        </div>

        <Link href="/participant/submissions">
          <Button variant="primary" size="sm" className="gap-1.5">
            <span>Submit Deliverable</span>
          </Button>
        </Link>
      </div>

      {/* Countdown Card */}
      <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-soft flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-rose-700">NEXT MANDATORY MILESTONE</div>
          <h3 className="font-bold text-base text-[#111111] mt-0.5">Ideation PPT Submission</h3>
          <p className="text-xs text-secondary mt-1">Upload 5-slide deck before review begins.</p>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-rose-700">Due in</div>
          <div className="text-2xl font-black font-mono-num text-rose-600">02h 14m</div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3.5">
        {events.map((ev) => (
          <div
            key={ev._id}
            className={`p-4 rounded-xl border bg-surface shadow-soft flex items-start justify-between gap-4 ${
              ev.isCompleted ? "opacity-75 border-border/60" : "border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-20 shrink-0 text-center">
                <div className="text-xs font-bold font-mono-num text-[#111111]">{ev.startTime}</div>
                <div className="text-[10px] text-secondary font-mono-num">{ev.endTime}</div>
              </div>

              <div className="h-10 w-px bg-border/80 self-center" />

              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={ev.type === "Submission" ? "danger" : "secondary"}>
                    {ev.type}
                  </Badge>
                  <span className="text-[10px] text-accent font-bold uppercase font-mono-num">
                    Phase: {ev.phase}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#111111] mt-1.5">{ev.title}</h3>
                {ev.description && (
                  <p className="text-xs text-secondary mt-0.5 leading-relaxed">{ev.description}</p>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-secondary mt-2">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{ev.location}</span>
                </div>
              </div>
            </div>

            {ev.isCompleted ? (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Done
              </span>
            ) : (
              <span className="text-xs font-bold text-accent font-mono-num bg-accent/10 px-2 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
