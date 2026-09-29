"use client";

import * as React from "react";
import { Plus, Calendar, Clock, CheckCircle2, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickActionModal } from "@/components/admin/QuickActionModal";

export default function SchedulePage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDay, setSelectedDay] = React.useState<number>(1);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchSchedule = React.useCallback(async () => {
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const toggleEventComplete = async (eventId: string, currentStatus: boolean) => {
    try {
      await fetch("/api/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, isCompleted: !currentStatus }),
      });
      fetchSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  const dayEvents = events.filter((e) => e.day === selectedDay);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Bootcamp Schedule & Milestones
            </h1>
            <Badge variant="accent" className="font-mono-num text-[11px]">
              Day 0{selectedDay} of 06
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Visual master timeline governing daily sprints, keynote briefings, mentor office hours, and submission gates.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Schedule Event</span>
        </Button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {[1, 2, 3, 4, 5, 6].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedDay === day
                ? "bg-[#111111] text-white shadow-xs font-mono-num"
                : "bg-surface text-secondary hover:text-[#111111] border border-border hover:bg-surface-subtle"
            }`}
          >
            Day 0{day}
            {day === 1 && (
              <span className="ml-1.5 text-[10px] text-accent font-normal">(Today)</span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-4 max-w-3xl">
        {dayEvents.length === 0 ? (
          <div className="p-12 text-center text-xs text-secondary border border-dashed border-border rounded-xl">
            No schedule events recorded for Day {selectedDay}.
          </div>
        ) : (
          dayEvents.map((ev, idx) => (
            <div
              key={ev._id}
              className={`p-4 rounded-xl border bg-surface shadow-soft flex items-start justify-between gap-4 transition-card ${
                ev.isCompleted ? "border-border/60 opacity-80" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0 w-20 pt-0.5">
                  <div className="text-xs font-bold font-mono-num text-[#111111]">{ev.startTime}</div>
                  <div className="text-[10px] text-secondary font-mono-num">{ev.endTime}</div>
                </div>

                <div className="h-10 w-px bg-border/80 self-center" />

                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={ev.type === "Submission" ? "danger" : "secondary"}>
                      {ev.type}
                    </Badge>
                    <span className="text-[10px] uppercase font-bold text-accent font-mono-num">
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

              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant={ev.isCompleted ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => toggleEventComplete(ev._id, ev.isCompleted)}
                  className="text-xs gap-1.5"
                >
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      ev.isCompleted ? "text-emerald-600" : "text-secondary"
                    }`}
                  />
                  <span>{ev.isCompleted ? "Completed" : "Mark Done"}</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <QuickActionModal
        actionType={isModalOpen ? "add_schedule" : null}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSchedule}
      />
    </div>
  );
}
