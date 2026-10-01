"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, MapPin, Plus, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function ParticipantSchedulePage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isTeamLead, setIsTeamLead] = React.useState(false);
  const [team, setTeam] = React.useState<any>(null);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Form State
  const [form, setForm] = React.useState({
    title: "",
    type: "Milestone",
    phase: "Ideation",
    day: 1,
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    location: "Pod Team Table / Lab 302",
    description: "",
  });

  const fetchScheduleAndUser = React.useCallback(async () => {
    try {
      setLoading(true);
      const [schedRes, meRes] = await Promise.all([
        fetch("/api/schedule?day=1").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ]);

      setEvents(schedRes.events || []);

      const user = meRes.participant || meRes.user;
      const myTeam = meRes.team;
      setTeam(myTeam);

      const isLeader =
        user?.roleInTeam === "Team Lead" ||
        myTeam?.members?.some(
          (m: any) =>
            (m.email?.toLowerCase() === user?.email?.toLowerCase() ||
              m.participant === user?._id) &&
            (m.isLeader || m.role === "Team Lead")
        );
      setIsTeamLead(Boolean(isLeader));
    } catch (err) {
      console.error("Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchScheduleAndUser();
  }, [fetchScheduleAndUser]);

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.title.trim()) {
      setErrorMsg("Please enter a milestone/deadline title.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: `[${team?.name || "Team"}] ${form.title.trim()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create deadline.");
        return;
      }

      setSuccessMsg("Team deadline created and added to schedule!");
      setTimeout(() => {
        setIsCreateOpen(false);
        setSuccessMsg(null);
        setForm({
          title: "",
          type: "Milestone",
          phase: "Ideation",
          day: 1,
          startTime: "02:00 PM",
          endTime: "03:30 PM",
          location: "Pod Team Table / Lab 302",
          description: "",
        });
        fetchScheduleAndUser();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error creating deadline.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextMilestone =
    events.find((e) => !e.isCompleted && (e.type === "Submission" || e.type === "Milestone")) ||
    events[0];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              Today&apos;s Bootcamp Schedule & Deadlines
            </h1>
            <Badge variant="accent">Day 01 — Ideation</Badge>
            {isTeamLead && (
              <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Team Lead Access
              </span>
            )}
          </div>
          <p className="text-xs text-secondary mt-1">
            Real-time track of keynote briefings, team formation gates, and milestone deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isTeamLead && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1.5 font-semibold text-xs border-accent/30 text-accent hover:bg-accent/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Team Deadline</span>
            </Button>
          )}

          <Link href="/participant/submissions">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Submit Deliverable</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Countdown Card */}
      {nextMilestone && (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-soft flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-rose-700">
              NEXT UPCOMING {nextMilestone.type?.toUpperCase()}
            </div>
            <h3 className="font-bold text-base text-[#111111] mt-0.5">
              {nextMilestone.title}
            </h3>
            <p className="text-xs text-secondary mt-1">
              {nextMilestone.description || "Upload deliverable and review with mentors before review begins."}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-rose-700">Scheduled Time</div>
            <div className="text-xl sm:text-2xl font-black font-mono-num text-rose-600">
              {nextMilestone.startTime}
            </div>
          </div>
        </div>
      )}

      {/* Events Timeline */}
      <div className="space-y-3.5">
        {events.map((ev) => (
          <div
            key={ev._id}
            className={`p-4 rounded-xl border bg-surface shadow-soft flex items-start justify-between gap-4 transition-all ${
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
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Done
              </span>
            ) : (
              <span className="text-xs font-bold text-accent font-mono-num bg-accent/10 px-2 py-0.5 rounded shrink-0">
                Active
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Create Team Deadline Modal for Team Lead */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Team Milestone / Deadline"
        description="Establish internal sprint checkpoints and review gates for your squad."
      >
        <form onSubmit={handleCreateDeadline} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="font-semibold text-[#111111]">
              Milestone / Deadline Title <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Sprint 1 Wireframe & Component Freeze"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-secondary">Milestone Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value="Milestone">Milestone Checkpoint</option>
                <option value="Submission">Deliverable Submission</option>
                <option value="Review">Mentor / Team Review</option>
                <option value="Workshop">Technical Workshop</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-secondary">Current Phase</label>
              <select
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value="Ideation">Ideation</option>
                <option value="Architecture">Architecture</option>
                <option value="Implementation">Implementation</option>
                <option value="Testing">Testing</option>
                <option value="Showcase">Showcase</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-secondary">Day</label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              >
                <option value={1}>Day 01</option>
                <option value={2}>Day 02</option>
                <option value={3}>Day 03</option>
                <option value={4}>Day 04</option>
                <option value={5}>Day 05</option>
                <option value={6}>Day 06</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-secondary">Target Start</label>
              <input
                type="text"
                placeholder="02:00 PM"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>

            <div>
              <label className="font-semibold text-secondary">Target End</label>
              <input
                type="text"
                placeholder="03:30 PM"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-secondary">Location / Pod</label>
            <input
              type="text"
              placeholder="e.g. Pod Team Table / Discord Lab"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>

          <div>
            <label className="font-semibold text-secondary">Deliverable Description</label>
            <textarea
              rows={2}
              placeholder="Explain expected checkpoint deliverables and success criteria..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border p-2 bg-surface text-[#111111]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Publish Team Deadline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
