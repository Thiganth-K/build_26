"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  UploadCloud,
  CheckCircle2,
  Users,
  Megaphone,
  MessageSquare,
  FileText,
  AlertCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { ParticipantHeader } from "@/components/participant/ParticipantHeader";
import { WorkLogModal } from "@/components/participant/WorkLogModal";
import { SubmissionModal } from "@/components/participant/SubmissionModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default function ParticipantDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isWorkLogOpen, setIsWorkLogOpen] = React.useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = React.useState(false);

  const fetchDashboard = React.useCallback(async () => {
    try {
      // Find Team Alpha (or first team)
      const teamsRes = await fetch("/api/teams").then((r) => r.json());
      const teamAlpha = teamsRes.teams?.[0];
      if (teamAlpha) {
        const teamDetailRes = await fetch(`/api/teams/${teamAlpha._id}`).then((r) => r.json());
        const annRes = await fetch("/api/announcements").then((r) => r.json());
        const schedRes = await fetch("/api/schedule?day=1").then((r) => r.json());

        setData({
          team: teamDetailRes.team,
          workLogs: teamDetailRes.workLogs || [],
          tasks: teamDetailRes.tasks || [],
          submissions: teamDetailRes.submissions || [],
          feedback: teamDetailRes.feedback || [],
          announcements: annRes.announcements?.slice(0, 3) || [],
          deadlines: schedRes.events || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading || !data?.team) {
    return (
      <div className="p-8 text-center text-xs text-secondary">
        Initializing participant workspace...
      </div>
    );
  }

  const { team, workLogs, tasks, submissions, feedback, announcements, deadlines } = data;
  const nextDeadline = deadlines.find((d: any) => !d.isCompleted && d.type === "Submission");
  const latestSubmission = submissions[0];

  return (
    <div className="min-h-screen bg-background pb-16">
      <ParticipantHeader
        participantName="Thiganth K."
        currentPhase={team.currentPhase}
        onOpenWorkLog={() => setIsWorkLogOpen(true)}
        onSubmitMilestone={() => setIsSubmissionOpen(true)}
      />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Banner: Good morning, Thiganth • Team Alpha */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-border/70">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono-num text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {team.code}
                </span>
                <Badge variant="success">Team Operational</Badge>
              </div>
              <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                {team.name}
              </h2>
              <div className="text-xs font-semibold text-accent mt-0.5">
                Challenge: {team.problemStatement?.title || "Smart Campus Navigation"}
              </div>
            </div>

            <div className="flex items-center gap-6 bg-surface-subtle/50 p-4 rounded-xl border border-border/80">
              <div>
                <div className="text-[10px] uppercase font-bold text-secondary">Current Phase</div>
                <div className="text-base font-bold text-[#111111] font-mono-num uppercase">
                  {team.currentPhase}
                </div>
              </div>
              <div className="h-8 w-px bg-border/70" />
              <div>
                <div className="text-[10px] uppercase font-bold text-secondary">Team Progress</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-bold text-accent font-mono-num">
                    {team.progress}%
                  </span>
                  <ProgressBar value={team.progress} color="accent" className="w-24 h-1.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
            <p className="text-secondary leading-relaxed max-w-2xl">
              {team.solutionTitle ? `${team.solutionTitle} — ` : ""}
              {team.solutionDescription}
            </p>

            <Link href="/participant/team">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>Manage Team & Solution</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Next Deadline & Milestone Gate */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  Next Milestone Gate
                </span>
                <span className="text-[10px] font-mono-num font-bold text-secondary">
                  Day 01
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#111111] mt-2">
                {nextDeadline?.title || "Ideation PPT & System Deck"}
              </h3>
              <p className="text-xs text-secondary mt-1">
                Mandatory submission required to enter Phase 2 Mentor Review.
              </p>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/60 flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Due in 02h 14m</span>
                </div>
                <span className="text-[11px] font-bold font-mono-num text-rose-700">
                  06:00 PM Sharp
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSubmissionOpen(true)}
                className="w-full text-xs"
              >
                Submit Milestone Deck Now
              </Button>
            </div>
          </div>

          {/* Card 2: Today's Active Sprint Tasks */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Today&apos;s Active Sprint Tasks
                </span>
                <Link
                  href="/participant/tasks"
                  className="text-[11px] text-accent font-semibold hover:underline"
                >
                  Kanban
                </Link>
              </div>

              <div className="space-y-2 mt-2">
                {tasks.slice(0, 3).map((t: any) => (
                  <div
                    key={t._id}
                    className="p-2 rounded bg-surface-subtle border border-border/50 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-[#111111] truncate">{t.title}</span>
                    <Badge variant="secondary" size="sm">
                      {t.column}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/participant/tasks">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View All {tasks.length} Tasks
              </Button>
            </Link>
          </div>

          {/* Card 3: Roster Team Members */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Team Members ({team.members?.length || 0}/4)
                </span>
                <span className="text-[10px] font-mono-num text-secondary">Assigned</span>
              </div>

              <div className="space-y-2.5 mt-2">
                {team.members?.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar name={m.name} size="sm" />
                      <span className="font-semibold text-[#111111]">{m.name}</span>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-secondary pt-2 border-t border-border/50">
              Assigned Mentor:{" "}
              <span className="font-semibold text-[#111111]">
                {team.mentor?.name || "Dr. Kumar Sundaram"}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Announcements, Mentor Feedback & Recent Work Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements Card */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Megaphone className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Bootcamp Announcements
              </h3>
            </div>

            <div className="space-y-3">
              {announcements.map((ann: any) => (
                <div
                  key={ann._id}
                  className="p-3 rounded-lg border border-border/80 bg-surface-subtle/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#111111]">{ann.title}</span>
                    <Badge
                      variant={ann.priority === "Urgent" ? "danger" : "secondary"}
                      size="sm"
                    >
                      {ann.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed line-clamp-2">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Feedback Card */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Latest Mentor Feedback
                </h3>
              </div>
              <Link
                href="/participant/feedback"
                className="text-[11px] text-accent font-semibold hover:underline"
              >
                All
              </Link>
            </div>

            {feedback.length > 0 ? (
              <div className="p-3.5 rounded-lg border border-border/80 bg-surface-subtle/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111]">{feedback[0].mentorName}</span>
                  <span className="font-bold text-amber-600 font-mono-num">
                    ★ {feedback[0].rating}/5
                  </span>
                </div>
                <p className="text-secondary italic leading-relaxed">
                  &ldquo;{feedback[0].generalFeedback}&rdquo;
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-secondary">
                No mentor feedback received yet.
              </div>
            )}
          </div>

          {/* Recent Work Logs Card */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  My Team Work Logs
                </h3>
              </div>
              <button
                onClick={() => setIsWorkLogOpen(true)}
                className="text-[11px] text-accent font-semibold hover:underline"
              >
                + New Entry
              </button>
            </div>

            <div className="space-y-2.5">
              {workLogs.slice(0, 3).map((log: any) => (
                <div
                  key={log._id}
                  className="p-2.5 rounded-lg border border-border/60 bg-surface-subtle/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#111111]">{log.participantName}</span>
                    <span className="font-mono-num text-[11px] text-secondary">
                      {log.timeSpentHours}h logged
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary line-clamp-1">{log.workDone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <WorkLogModal
        isOpen={isWorkLogOpen}
        onClose={() => setIsWorkLogOpen(false)}
        onSuccess={fetchDashboard}
        teamId={team._id}
        participantName="Thiganth K."
      />

      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        onSuccess={fetchDashboard}
        teamId={team._id}
        currentPhase={team.currentPhase}
      />
    </div>
  );
}
