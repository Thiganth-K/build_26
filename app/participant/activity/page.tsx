"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Clock,
  Users,
  Flag,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamActivityPage() {
  const [team, setTeam] = React.useState<any>(null);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [workLogs, setWorkLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").then((r) => r.json());
      if (meRes.team) {
        setTeam(meRes.team);
        const [actRes, subRes, logsRes] = await Promise.all([
          fetch(`/api/activity?teamId=${meRes.team._id}`).then((r) => r.json()).catch(() => ({ activities: [] })),
          fetch(`/api/submissions?teamId=${meRes.team._id}`).then((r) => r.json()).catch(() => ({ submissions: [] })),
          fetch(`/api/worklogs`).then((r) => r.json()).catch(() => ({ workLogs: [] })),
        ]);
        setActivities(actRes.activities || []);
        setSubmissions(subRes.submissions || []);
        setWorkLogs(logsRes.workLogs || []);
      }
    } catch (err) {
      console.error("Error loading team activity:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <div className="font-semibold text-secondary">Loading Team Activity & Progress...</div>
      </div>
    );
  }

  const teamName = team?.name || "TEAM SPACE";
  const currentMilestoneDay = team?.currentMilestoneDay || 1;

  // Real events from DB (Section 19: No fabricated activities)
  const displayEvents = activities.map((a) => ({
    time: new Date(a.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    text: a.title || a.description || "Team activity recorded",
  }));

  // Real progress derived authentically from submissions (Section 17)
  const submittedDaysCount = [1, 2, 3, 4, 5, 6].filter((d) =>
    submissions.some((s) => s.day === d && s.status?.toUpperCase() === "SUBMITTED")
  ).length;

  const overallPercent = Math.min(100, Math.round((submittedDaysCount / 6) * 100));
  const overallFilledCount = Math.round(overallPercent / 5);
  const overallEmptyCount = 20 - overallFilledCount;
  const overallBarStr = "█".repeat(overallFilledCount) + "░".repeat(overallEmptyCount);

  const dayProgress = [1, 2, 3, 4, 5, 6].map((d) => {
    const isSubmitted = submissions.some((s) => s.day === d && s.status?.toUpperCase() === "SUBMITTED");
    const hasWorkLogs = workLogs.some((w) => w.day === d);
    let percent = 0;
    if (isSubmitted) {
      percent = 100;
    } else if (d === currentMilestoneDay && hasWorkLogs) {
      percent = 30;
    }
    return {
      day: `DAY 0${d}`,
      dayNum: d,
      percent,
      isSubmitted,
      isActive: d === currentMilestoneDay && !isSubmitted,
      isUpcoming: d > currentMilestoneDay && !isSubmitted,
    };
  });

  // Authentic member contributions derived from real worklogs
  const members = (team?.members || []).map((m: any) => {
    const memberLogs = workLogs.filter(
      (w: any) => w.participant?.toString() === m._id?.toString() || w.participantId === m._id?.toString()
    );
    const percent = Math.min(100, memberLogs.length * 25);
    return {
      name: m.name,
      role: m.role || "Team Member",
      percent,
      logsCount: memberLogs.length,
    };
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Wireframe Section 32: TEAM ACTIVITY */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
                SECTION 32
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#111111]">
                TEAM ACTIVITY
              </h1>
              <p className="text-xs text-secondary mt-0.5">
                Real-time log of team collaboration actions, deliverable uploads, and commits.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono-num font-bold uppercase self-start sm:self-auto">
              {teamName}
            </Badge>
          </div>

          <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                TODAY
              </div>

              {displayEvents.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-border bg-surface text-center space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    NO TEAM ACTIVITY YET
                  </div>
                  <p className="text-xs text-secondary max-w-sm mx-auto">
                    Team actions, invitations, problem selection, and deliverable submissions will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {displayEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-secondary font-bold shrink-0">{evt.time}</span>
                      <span className="text-accent">●</span>
                      <span className="text-[#111111] font-medium">{evt.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                MILESTONE PROGRESS
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {dayProgress.map((dp) => {
                  const filledCount = Math.round(dp.percent / 5);
                  const emptyCount = 20 - filledCount;
                  const barStr = "█".repeat(filledCount) + "░".repeat(emptyCount);

                  return (
                    <div key={dp.day} className="flex items-center justify-between gap-4">
                      <span className="font-bold text-[#111111] w-16 shrink-0">{dp.day}</span>
                      <span className="text-black font-mono tracking-tight flex-1 truncate">
                        {barStr}
                      </span>
                      <span className="font-bold text-right w-12 shrink-0">{dp.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Wireframe Section 33: TEAM PROGRESS & MEMBER CONTRIBUTIONS */}
        <section className="space-y-4 pt-4">
          <div className="pb-3 border-b border-border">
            <span className="text-[10px] font-mono-num font-bold text-accent uppercase tracking-widest">
              SECTION 33
            </span>
            <h2 className="text-xl font-black text-[#111111]">
              TEAM PROGRESS
            </h2>
            <div className="text-xs font-bold text-accent uppercase mt-0.5">
              {teamName}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-surface p-7 shadow-soft space-y-6">
            {/* Overall Progress Block */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                OVERALL PROGRESS
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-black tracking-tight text-base font-bold">
                  {overallBarStr}
                </span>
                <span className="font-black text-lg text-[#111111]">{overallPercent}%</span>
              </div>
            </div>

            {/* Day Status List */}
            <div className="space-y-1.5 font-mono text-xs py-2 border-y border-border/80">
              {dayProgress.map((dp) => (
                <div key={dp.day} className="flex items-center gap-4">
                  <span className="font-bold w-16 text-[#111111]">{dp.day}</span>
                  {dp.isSubmitted ? (
                    <span className="text-emerald-700 font-bold">✓ COMPLETE</span>
                  ) : dp.isActive ? (
                    <span className="text-accent font-bold">● IN PROGRESS</span>
                  ) : (
                    <span className="text-secondary font-medium">○ LOCKED / UPCOMING</span>
                  )}
                </div>
              ))}
            </div>

            {/* Member Contributions */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                MEMBER CONTRIBUTIONS
              </div>

              {members.length === 0 ? (
                <div className="text-xs text-secondary py-2">No active members found.</div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {members.map((m: any, idx: number) => {
                    const filledCount = Math.round(m.percent / 5);
                    const emptyCount = 20 - filledCount;
                    const barStr = "█".repeat(filledCount) + "░".repeat(emptyCount);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111111]">
                            {m.name} <span className="text-[10px] text-secondary font-normal font-sans">({m.role})</span>
                          </span>
                          <span className="font-bold text-accent">{m.percent}%</span>
                        </div>
                        <div className="text-black font-mono tracking-tight text-xs">
                          {barStr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
